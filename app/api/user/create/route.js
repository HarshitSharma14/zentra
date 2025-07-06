// Instead of create → update, do this:

import { prepareMockTransactions, generateMonthlyBudget, generateYearlyBudget } from "@/lib/mockTransactions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { withMockData } = await request.json();

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Generate budgets based on mock data
        const monthlyBudget = withMockData ? generateMonthlyBudget() : {};
        const yearlyBudget = withMockData ? generateYearlyBudget() : {};

        // Prepare complete user object upfront
        const newUser = {
            _id: new ObjectId(),
            categories: [],
            monthlyBudget: {
                enabled: withMockData ? true : false,
                autoRenew: withMockData ? true : false,
                categories: monthlyBudget
            },
            yearlyBudget: {
                enabled: withMockData ? true : false,
                autoRenew: withMockData ? true : false,
                categories: yearlyBudget
            }
        };

        // Single insert - no update needed
        await db.collection('users').insertOne(newUser);

        let finalBalance = 0;

        let summaryData = withMockData ? {
            totalBalance: 8690.17,        // Final running balance after all transactions
            monthlyIncome: 5608.33,       // Average monthly income (16825 total / 3 months)
            monthlySpent: 2711.61,        // Average monthly spending (8134.83 total / 3 months)
            yearlyIncome: 16825.00,       // Total income from all transactions
            yearlySpent: 8134.83          // Total spending from all transactions
        } :
            {
                totalBalance: 0,
                monthlyIncome: 0,
                monthlySpent: 0,
                yearlyIncome: 0,
                yearlySpent: 0
            };

        // Add mock transactions if requested
        if (withMockData) {
            const { transactions, finalBalance: mockBalance } = prepareMockTransactions(newUser._id);

            const transactionsWithIds = transactions.map(tx => ({
                _id: new ObjectId(),
                ...tx
            }));

            await db.collection('transactions').insertMany(transactionsWithIds);

            // Update summary data with actual calculated balance
            summaryData.totalBalance = mockBalance;
        }

        return NextResponse.json({
            success: true,
            userId: newUser._id.toString(),
            budgetData: {
                monthlyBudget: monthlyBudget,
                yearlyBudget: yearlyBudget
            },
            summaryData: summaryData,
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