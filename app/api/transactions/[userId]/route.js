// app/api/transactions/[userId]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { recalculateAfterAdd } from '../recalculateBalances';


export async function GET(request, { params }) {
    try {
        const { userId } = await params;
        const { searchParams } = new URL(request.url);
        const limit = 20;
        const cursorParam = searchParams.get('cursor'); // JSON string cursor

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Build match criteria
        const matchCriteria = { userId: new ObjectId(userId) };

        // Get transactions with cursor-based pagination
        const transactions = await db.collection('transactions')
            .find(matchCriteria)
            .sort({ date: -1, _id: -1 }) // Sort by date descending, then _id descending
            .toArray();


        // Format transactions for response
        const formattedTransactions = transactions.map(tx => ({
            _id: tx._id.toString(),
            amount: tx.amount,
            category: tx.category,
            description: tx.description,
            date: tx.date,
            runningBalance: tx.runningBalance,
        }));

        return NextResponse.json({
            success: true,
            transactions: formattedTransactions,
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const { userId } = await params;
        const transactionData = await request.json();

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!transactionData.amount || !transactionData.category  || !transactionData.date) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        const date = new Date(transactionData.date);
        const newTransaction = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            description: transactionData.description,
            date: date,
            runningBalance: 0 // Will be recalculated
        };

        // Insert the new transaction
        await db.collection('transactions').insertOne(newTransaction);

        // Efficiently recalculate running balances only for transactions from this date onwards
        await recalculateAfterAdd(db, userId, date);

        // Get the updated transaction with correct running balance
        const updatedTransaction = await db.collection('transactions').findOne({
            _id: newTransaction._id
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
        console.error('Error adding transaction:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add transaction' },
            { status: 500 }
        );
    }
}


