// app/api/budget/[userId]/route.js
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

        // Get user's budgets
        const user = await db.collection('users').findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        const budgets = {
            monthly: user.monthlyBudget || {
                enabled: false,
                totalBudget: 0,
                autoRenew: false,
                categories: {}
            },
            yearly: user.yearlyBudget || {
                enabled: false,
                totalBudget: 0,
                autoRenew: false,
                categories: {}
            }
        };

        return NextResponse.json({
            success: true,
            budgets
        });

    } catch (error) {
        console.error('Error fetching budgets:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch budgets' },
            { status: 500 }
        );
    }
}

export async function POST(request, { params }) {
    try {
        const { userId } = await params;
        const { budgetType, enabled, totalBudget, autoRenew, categories } = await request.json();

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!budgetType || typeof enabled !== 'boolean' || !totalBudget) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
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

        const budgetData = {
            enabled,
            totalBudget: parseFloat(totalBudget),
            autoRenew: autoRenew || false,
            categories: categories || {}
        };

        // Update the specific budget field
        const updateField = budgetType === 'monthly' ? 'monthlyBudget' : 'yearlyBudget';

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: { [updateField]: budgetData }
            },
            { upsert: true }
        );

        if (result.acknowledged) {
            return NextResponse.json({
                success: true,
                budget: budgetData,
                message: `${budgetType.charAt(0).toUpperCase() + budgetType.slice(1)} budget saved successfully`
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Failed to save budget' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error saving budget:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save budget' },
            { status: 500 }
        );
    }
}