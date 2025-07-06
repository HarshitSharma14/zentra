// app/api/budget/[userId]/[budgetType]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
    try {
        const { userId, budgetType } = await params;

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Validate budget type
        if (!['monthly', 'yearly'].includes(budgetType)) {
            return NextResponse.json(
                { success: false, message: 'Invalid budget type' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Check if user exists
        const user = await db.collection('users').findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Reset the specific budget field
        const updateField = budgetType === 'monthly' ? 'monthlyBudget' : 'yearlyBudget';
        const resetBudget = {
            enabled: false,
            totalBudget: 0,
            autoRenew: false,
            categories: {}
        };

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: { [updateField]: resetBudget }
            }
        );

        if (result.acknowledged) {
            return NextResponse.json({
                success: true,
                message: `${budgetType.charAt(0).toUpperCase() + budgetType.slice(1)} budget deleted successfully`
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Failed to delete budget' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error deleting budget:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete budget' },
            { status: 500 }
        );
    }
}