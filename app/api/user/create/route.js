// Instead of create → update, do this:

import { prepareMockTransactions } from "@/lib/mockTransactions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { withMockData } = await request.json();

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Prepare complete user object upfront
        const newUser = {
            _id: new ObjectId(),
            createdAt: new Date(),
            monthlyBudget: {
                enabled: withMockData ? true : false,
                autoRenew: withMockData ? true : false,
                categories: withMockData ? {
                    'Food & Dining': 600,
                    'Transportation': 300,
                    'Bills & Utilities': 800,
                    'Entertainment': 200,
                    'Shopping': 400,
                    'Healthcare': 250,
                    'Other': 200
                } : {}
            },
            yearlyBudget: {
                enabled: false,
                autoRenew: false,
                categories: {}
            }
        };

        // Single insert - no update needed
        await db.collection('users').insertOne(newUser);

        let finalBalance = 0;

        // Add mock transactions if requested
        if (withMockData) {
            const { transactions, finalBalance: mockBalance } = prepareMockTransactions(newUser._id);

            const transactionsWithIds = transactions.map(tx => ({
                _id: new ObjectId(),
                ...tx
            }));

            await db.collection('transactions').insertMany(transactionsWithIds);
            finalBalance = mockBalance;
        }

        return NextResponse.json({
            success: true,
            userId: newUser._id.toString(),
            user: newUser,
            currentBalance: finalBalance,
            message: withMockData ?
                'User created with mock data' : 'User created successfully'
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create user' },
            { status: 500 }
        );
    }
}