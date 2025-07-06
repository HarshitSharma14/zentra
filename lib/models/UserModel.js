// models/User.js
import { Schema, model } from "mongoose";

import { ObjectId } from 'mongodb';

const userSchema = new Schema({
    _id: ObjectId,
    categories: [String],
    monthlyBudget: {
        enabled: Boolean,
        totalBudget: Number,  // Added totalBudget field
        autoRenew: Boolean,
        categories: {}
    },
    yearlyBudget: {
        enabled: Boolean,
        totalBudget: Number,  // Added totalBudget field
        autoRenew: Boolean,
        categories: {}
    }
});

const User = model("User", userSchema);


export default User;