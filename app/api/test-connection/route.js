// app/api/test-connection/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('zentra-finance');

        // Test the connection by pinging the database
        await db.admin().ping();

        // Get database stats
        const stats = await db.stats();

        return Response.json({
            success: true,
            message: 'MongoDB connection successful!',
            database: db.databaseName,
            collections: stats.collections || 0,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return Response.json(
            {
                success: false,
                message: 'MongoDB connection failed',
                error: error.message
            },
            { status: 500 }
        );
    }
}