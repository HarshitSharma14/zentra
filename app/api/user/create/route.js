// app/api/user/create/route.js
import {
    prepareMockTransactions,
    generateMonthlyBudget,
    generateYearlyBudget
} from "@/lib/mockTransactions";
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
            categories: []
        };

        let summaryData = {
            totalBalance: 0,
            monthlyIncome: 0,
            monthlySpent: 0,
            yearlyIncome: 0,
            yearlySpent: 0
        };

        let monthlyBudget = {
            enabled: false,
            totalBudget: 0,
            autoRenew: false,
            categories: {}
        };

        let yearlyBudget = {
            enabled: false,
            totalBudget: 0,
            autoRenew: false,
            categories: {}
        };

        // Generate comprehensive mock data if requested
        if (withMockData) {
            // First, create transactions to analyze spending patterns
            const mockResult = prepareMockTransactions(newUser._id);
            const transactions = mockResult.transactions;

            // Use calculated summary data from actual transactions
            summaryData = mockResult.summaryData;

            // Generate realistic budgets based on actual spending patterns
            const monthlyBudgetData = generateMonthlyBudget(transactions);
            const yearlyBudgetData = generateYearlyBudget(transactions);

            monthlyBudget = {
                enabled: true,
                totalBudget: monthlyBudgetData.totalBudget,
                autoRenew: true,
                categories: monthlyBudgetData.categories
            };

            yearlyBudget = {
                enabled: true,
                totalBudget: yearlyBudgetData.totalBudget,
                autoRenew: true,
                categories: yearlyBudgetData.categories
            };

            // Add transactions to database with ObjectIds
            const transactionsWithIds = transactions.map(tx => ({
                _id: new ObjectId(),
                ...tx
            }));

            await db.collection('transactions').insertMany(transactionsWithIds);
        }

        // Complete user object with budget data
        newUser.monthlyBudget = monthlyBudget;
        newUser.yearlyBudget = yearlyBudget;

        // Insert user into database
        await db.collection('users').insertOne(newUser);

        return NextResponse.json({
            success: true,
            userId: newUser._id.toString(),
            budgetData: {
                monthlyBudget: monthlyBudget,
                yearlyBudget: yearlyBudget
            },
            summaryData: summaryData,
            categories: [],
            message: withMockData
                ? 'User created with comprehensive 75-day transaction history and realistic budgets'
                : 'User created successfully'
        });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create user' },
            { status: 500 }
        );
    }
}