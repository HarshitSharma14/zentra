// models/User.js
import { Schema, model } from "mongoose";

import { ObjectId } from 'mongodb';

const userSchema = new Schema({
    _id: ObjectId,
    createdAt: Date,
    monthlyBudget: {
        enabled: Boolean,
        autoRenew: Boolean,
        categories: {}
    },
    yearlyBudget: {
        enabled: Boolean,
        autoRenew: Boolean,
        categories: {}
    }
});

const User = model("User", userSchema);


export default User;