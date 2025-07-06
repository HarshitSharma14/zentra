import { ObjectId } from 'mongodb';

/**
 * Efficiently recalculate running balances starting from a specific date
 * Only recalculates transactions on or after the affected date
 * @param {Object} db - MongoDB database instance
 * @param {string} userId - User ID
 * @param {Date} fromDate - Date from which to start recalculating (inclusive)
 * @param {string} excludeTransactionId - Transaction ID to exclude (for delete operations)
 * @returns {Promise<number>} - Final running balance
 */
export async function recalculateRunningBalances(db, userId, fromDate = null, excludeTransactionId = null) {
    // If no fromDate provided, recalculate all transactions (fallback)
    if (!fromDate) {
        return await recalculateAllTransactions(db, userId, excludeTransactionId);
    }

    // Get the running balance just before the affected date
    const previousTransaction = await db.collection('transactions')
        .findOne(
            {
                userId: new ObjectId(userId),
                date: { $lt: fromDate },
                ...(excludeTransactionId && { _id: { $ne: new ObjectId(excludeTransactionId) } })
            },
            {
                sort: { date: -1, _id: -1 }, // Latest transaction before the affected date
                projection: { runningBalance: 1 }
            }
        );

    // Starting balance (0 if no previous transactions)
    let runningBalance = previousTransaction ? previousTransaction.runningBalance : 0;

    // Get all transactions from the affected date onwards, sorted chronologically
    const affectedTransactions = await db.collection('transactions')
        .find({
            userId: new ObjectId(userId),
            date: { $gte: fromDate },
            ...(excludeTransactionId && { _id: { $ne: new ObjectId(excludeTransactionId) } })
        })
        .sort({ date: 1, _id: 1 }) // Sort by date ascending, then _id ascending
        .toArray();

    const updates = [];

    // Calculate new running balances for affected transactions
    for (const transaction of affectedTransactions) {
        runningBalance += transaction.amount;
        const newRunningBalance = Math.round(runningBalance * 100) / 100; // Round to 2 decimal places

        updates.push({
            updateOne: {
                filter: { _id: transaction._id },
                update: { $set: { runningBalance: newRunningBalance } }
            }
        });
    }

    // Bulk update affected transactions with new running balances
    if (updates.length > 0) {
        await db.collection('transactions').bulkWrite(updates);
    }

    return runningBalance;
}

/**
 * Fallback function to recalculate all transactions (when needed)
 * @param {Object} db - MongoDB database instance
 * @param {string} userId - User ID
 * @param {string} excludeTransactionId - Transaction ID to exclude (for delete operations)
 * @returns {Promise<number>} - Final running balance
 */
async function recalculateAllTransactions(db, userId, excludeTransactionId = null) {
    // Get all transactions for the user, sorted by date (oldest first)
    const transactions = await db.collection('transactions')
        .find({
            userId: new ObjectId(userId),
            ...(excludeTransactionId && { _id: { $ne: new ObjectId(excludeTransactionId) } })
        })
        .sort({ date: 1, _id: 1 }) // Sort by date ascending, then _id ascending
        .toArray();

    let runningBalance = 0;
    const updates = [];

    // Calculate new running balances
    for (const transaction of transactions) {
        runningBalance += transaction.amount;
        const newRunningBalance = Math.round(runningBalance * 100) / 100; // Round to 2 decimal places

        updates.push({
            updateOne: {
                filter: { _id: transaction._id },
                update: { $set: { runningBalance: newRunningBalance } }
            }
        });
    }

    // Bulk update all transactions with new running balances
    if (updates.length > 0) {
        await db.collection('transactions').bulkWrite(updates);
    }

    return runningBalance;
}

/**
 * Helper function for add operations
 * @param {Object} db - MongoDB database instance
 * @param {string} userId - User ID
 * @param {Date} transactionDate - Date of the new transaction
 * @returns {Promise<number>} - Final running balance
 */
export async function recalculateAfterAdd(db, userId, transactionDate) {
    return await recalculateRunningBalances(db, userId, transactionDate);
}

/**
 * Helper function for update operations
 * @param {Object} db - MongoDB database instance
 * @param {string} userId - User ID
 * @param {Date} oldDate - Original date of the transaction
 * @param {Date} newDate - New date of the transaction
 * @returns {Promise<number>} - Final running balance
 */
export async function recalculateAfterUpdate(db, userId, oldDate, newDate) {
    // Start recalculating from the earliest affected date
    const earliestDate = oldDate < newDate ? oldDate : newDate;
    return await recalculateRunningBalances(db, userId, earliestDate);
}

/**
 * Helper function for delete operations
 * @param {Object} db - MongoDB database instance
 * @param {string} userId - User ID
 * @param {Date} deletedTransactionDate - Date of the deleted transaction
 * @param {string} deletedTransactionId - ID of the deleted transaction
 * @returns {Promise<number>} - Final running balance
 */
export async function recalculateAfterDelete(db, userId, deletedTransactionDate, deletedTransactionId) {
    return await recalculateRunningBalances(db, userId, deletedTransactionDate, deletedTransactionId);
} 