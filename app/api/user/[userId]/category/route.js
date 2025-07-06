import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    try {
        const userId = await params.userId;
        const { category } = await request.json();
        const client = await clientPromise;
        const db = client.db('zentra-finance');
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $push: { categories: category } }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting categories:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}