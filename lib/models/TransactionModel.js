// models/Transaction.js
import { Schema, model } from "mongoose";
import { ObjectId } from 'mongodb';

const transactionSchema = new Schema({
    _id: ObjectId,
    userId: ObjectId,
    amount: Number,
    category: String,
    description: String,
    date: String,
    runningBalance: Number,
    createdAt: Date,
    updatedAt: Date
});

const Transaction = model("Transaction", transactionSchema);

export default Transaction;