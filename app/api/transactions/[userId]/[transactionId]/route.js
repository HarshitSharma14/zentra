import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { recalculateAfterUpdate, recalculateAfterDelete } from '../../recalculateBalances';

export async function PUT(request, { params }) {
    try {
        const { userId, transactionId } = await params;
        const transactionData = await request.json();

        // Validate ObjectId format
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(transactionId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid ID format' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!transactionData.amount || !transactionData.category || !transactionData.description || !transactionData.date) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Check if transaction exists and belongs to the user
        const existingTransaction = await db.collection('transactions').findOne({
            _id: new ObjectId(transactionId),
            userId: new ObjectId(userId)
        });

        if (!existingTransaction) {
            return NextResponse.json(
                { success: false, message: 'Transaction not found' },
                { status: 404 }
            );
        }

        const date = new Date(transactionData.date);
        const updateData = {
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            description: transactionData.description,
            date: date,
            runningBalance: 0 // Will be recalculated
        };

        // Update the transaction
        await db.collection('transactions').updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: updateData }
        );

        // Efficiently recalculate running balances only from the earliest affected date
        await recalculateAfterUpdate(db, userId, existingTransaction.date, date);

        // Get the updated transaction with correct running balance
        const updatedTransaction = await db.collection('transactions').findOne({
            _id: new ObjectId(transactionId)
        });

        return NextResponse.json({
            success: true,
            transaction: {
                _id: updatedTransaction._id.toString(),
                amount: updatedTransaction.amount,
                category: updatedTransaction.category,
                description: updatedTransaction.description,
                date: updatedTransaction.date,
                runningBalance: updatedTransaction.runningBalance
            }
        });

    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update transaction' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId, transactionId } = await params;

        // Validate ObjectId format
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(transactionId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Check if transaction exists and belongs to the user
        const existingTransaction = await db.collection('transactions').findOne({
            _id: new ObjectId(transactionId),
            userId: new ObjectId(userId)
        });

        if (!existingTransaction) {
            return NextResponse.json(
                { success: false, message: 'Transaction not found' },
                { status: 404 }
            );
        }

        // Delete the transaction
        await db.collection('transactions').deleteOne({
            _id: new ObjectId(transactionId)
        });

        // Efficiently recalculate running balances only for transactions after the deleted date
        await recalculateAfterDelete(db, userId, existingTransaction.date, transactionId);

        return NextResponse.json({
            success: true,
            message: 'Transaction deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete transaction' },
            { status: 500 }
        );
    }
} 