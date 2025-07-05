// app/api/user/[userId]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { userId } = await params;

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Find user by ID
        const user = await db.collection('users').findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Get current balance (latest transaction)
        const latestTransaction = await db.collection('transactions')
            .findOne(
                { userId: new ObjectId(userId) },
                { sort: { date: -1 } }
            );

        const currentBalance = latestTransaction ? latestTransaction.runningBalance : 0;

        // Get transaction count
        const transactionCount = await db.collection('transactions')
            .countDocuments({ userId: new ObjectId(userId) });

        return NextResponse.json({
            success: true,
            user: user,
            currentBalance: currentBalance,
            transactionCount: transactionCount
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}