// app/api/analytics/monthly/[userId]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const { userId } = await params;
        const { searchParams } = new URL(request.url);

        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid user ID' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Get month and year from query params, or use current date
        const now = new Date();
        const targetMonth = searchParams.get('month') ? parseInt(searchParams.get('month')) : now.getMonth();
        const targetYear = searchParams.get('year') ? parseInt(searchParams.get('year')) : now.getFullYear();

        // Validate month and year
        if (targetMonth < 0 || targetMonth > 11 || targetYear < 2000 || targetYear > 2100) {
            return NextResponse.json(
                { success: false, message: 'Invalid month or year parameters' },
                { status: 400 }
            );
        }

        // Target month start and end dates
        const monthStart = new Date(targetYear, targetMonth, 1);
        const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        // 1. PIE CHART - Category wise expenses for target month
        const categoryPipeline = [
            {
                $match: {
                    userId: new ObjectId(userId),
                    date: { $gte: monthStart, $lte: monthEnd },
                    amount: { $lt: 0 } // Only expenses
                }
            },
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: { $abs: "$amount" } }
                }
            },
            {
                $sort: { amount: -1 }
            }
        ];

        // 2. BAR CHART - Daily expenses for target month
        const dailyPipeline = [
            {
                $match: {
                    userId: new ObjectId(userId),
                    date: { $gte: monthStart, $lte: monthEnd },
                    amount: { $lt: 0 } // Only expenses
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$date" },
                    amount: { $sum: { $abs: "$amount" } }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ];

        // Execute both queries
        const [categoryData, dailyData] = await Promise.all([
            db.collection('transactions').aggregate(categoryPipeline).toArray(),
            db.collection('transactions').aggregate(dailyPipeline).toArray()
        ]);

        // Format category data for pie chart
        const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);
        const pieChartData = categoryData.map(item => ({
            category: item._id,
            amount: Math.round(item.amount * 100) / 100,
            percentage: totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100 * 10) / 10 : 0
        }));

        // Format daily data for bar chart (fill missing days with 0)
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const barChartData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dayData = dailyData.find(d => d._id === day);
            barChartData.push({
                day,
                amount: dayData ? Math.round(dayData.amount * 100) / 100 : 0
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                pieChart: pieChartData,
                barChart: barChartData,
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}