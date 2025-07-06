// app/api/user/[userId]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const getSummaryAggregation = (userId) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based (0 = January)

    // Calculate first day of current month and year
    const monthStart = new Date(currentYear, currentMonth, 1);
    const yearStart = new Date(currentYear, 0, 1);

    return [
        // Match transactions for specific user
        {
            $match: {
                userId: new ObjectId(userId)
            }
        },

        // Sort by date descending to get latest transaction first
        {
            $sort: { date: -1 }
        },

        // Group all transactions and calculate totals
        {
            $group: {
                _id: null,

                // Get current balance from the first (latest) transaction
                totalBalance: { $first: "$runningBalance" },

                // Calculate monthly income (current month, positive amounts)
                monthlyIncome: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gte: ["$date", monthStart] },
                                    { $gt: ["$amount", 0] }
                                ]
                            },
                            "$amount",
                            0
                        ]
                    }
                },

                // Calculate monthly spent (current month, negative amounts)
                monthlySpent: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gte: ["$date", monthStart] },
                                    { $lt: ["$amount", 0] }
                                ]
                            },
                            { $abs: "$amount" },
                            0
                        ]
                    }
                },

                // Calculate yearly income (current year, positive amounts)
                yearlyIncome: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gte: ["$date", yearStart] },
                                    { $gt: ["$amount", 0] }
                                ]
                            },
                            "$amount",
                            0
                        ]
                    }
                },

                // Calculate yearly spent (current year, negative amounts)
                yearlySpent: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gte: ["$date", yearStart] },
                                    { $lt: ["$amount", 0] }
                                ]
                            },
                            { $abs: "$amount" },
                            0
                        ]
                    }
                }
            }
        },

        // Round financial values to 2 decimal places
        {
            $project: {
                totalBalance: { $round: ["$totalBalance", 2] },
                monthlyIncome: { $round: ["$monthlyIncome", 2] },
                monthlySpent: { $round: ["$monthlySpent", 2] },
                yearlyIncome: { $round: ["$yearlyIncome", 2] },
                yearlySpent: { $round: ["$yearlySpent", 2] },
            }
        }
    ];
};

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

        const result = await db.collection('transactions')
            .aggregate(getSummaryAggregation(userId))
            .toArray();

        return NextResponse.json({
            success: true,
            user: user,
            categories: user.categories || [],
            summaryData: result[0] || {
                totalBalance: 0,
                monthlyIncome: 0,
                monthlySpent: 0,
                yearlyIncome: 0,
                yearlySpent: 0
            },
            budgetData: {
                monthlyBudget: user.monthlyBudget || {
                    enabled: false,
                    totalBudget: 0,  // Include totalBudget
                    autoRenew: false,
                    categories: {}
                },
                yearlyBudget: user.yearlyBudget || {
                    enabled: false,
                    totalBudget: 0,  // Include totalBudget
                    autoRenew: false,
                    categories: {}
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}