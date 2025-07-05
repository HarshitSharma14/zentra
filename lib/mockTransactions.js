// lib/mockTransactions.js

/**
 * 30 Mock transactions template (without dates)
 * Realistic spending patterns with income and expenses
 */
export const MOCK_TRANSACTIONS = [
    // Income transactions
    { amount: 5000.00, category: "Income", description: "Monthly salary" },
    { amount: 4800.00, category: "Income", description: "Monthly salary" },
    { amount: 350.00, category: "Income", description: "Freelance project" },
    { amount: 4800.00, category: "Income", description: "Monthly salary" },

    // Bills & Utilities
    { amount: -1200.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -1200.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -1200.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -140.00, category: "Bills & Utilities", description: "Electricity bill" },
    { amount: -165.00, category: "Bills & Utilities", description: "Gas bill" },
    { amount: -80.00, category: "Bills & Utilities", description: "Internet & phone" },

    // Food & Dining
    { amount: -125.75, category: "Food & Dining", description: "Weekly groceries" },
    { amount: -95.25, category: "Food & Dining", description: "Weekly groceries" },
    { amount: -110.30, category: "Food & Dining", description: "Grocery shopping" },
    { amount: -135.75, category: "Food & Dining", description: "Weekly groceries" },
    { amount: -85.50, category: "Food & Dining", description: "Restaurant dinner" },
    { amount: -28.75, category: "Food & Dining", description: "Coffee shop" },
    { amount: -125.40, category: "Food & Dining", description: "Grocery shopping" },
    { amount: -95.60, category: "Food & Dining", description: "Weekly groceries" },

    // Transportation
    { amount: -45.75, category: "Transportation", description: "Gas station" },
    { amount: -60.00, category: "Transportation", description: "Uber rides" },
    { amount: -42.50, category: "Transportation", description: "Gas station" },

    // Shopping
    { amount: -199.99, category: "Shopping", description: "Winter jacket" },
    { amount: -89.99, category: "Shopping", description: "Online shopping" },
    { amount: -180.00, category: "Shopping", description: "Clothing store" },
    { amount: -320.50, category: "Shopping", description: "Electronics" },

    // Entertainment
    { amount: -35.50, category: "Entertainment", description: "Movie tickets" },
    { amount: -52.80, category: "Entertainment", description: "Concert tickets" },
    { amount: -75.25, category: "Entertainment", description: "Dinner with friends" },

    // Healthcare
    { amount: -220.00, category: "Healthcare", description: "Dental checkup" },

    // Other
    { amount: -150.25, category: "Other", description: "Miscellaneous" }
];

/**
 * Generate dates: 1 transaction every 3 days going backwards
 */
export const generateDates = (count) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const daysBack = i * 3;
        const transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - daysBack);
        dates.push(transactionDate);
    }

    return dates.reverse(); // Oldest first
};

/**
 * Prepare mock transactions with dates and running balance
 */
export const prepareMockTransactions = (userId) => {
    const dates = generateDates(MOCK_TRANSACTIONS.length);
    let runningBalance = 10000;
    const transactions = [];

    // Process chronologically (oldest first)
    const reversedTransactions = [...MOCK_TRANSACTIONS].reverse();

    reversedTransactions.forEach((transaction, index) => {
        runningBalance += transaction.amount;

        transactions.push({
            userId: userId,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            date: dates[index],
            runningBalance: Math.round(runningBalance * 100) / 100
        });
    });

    return {
        transactions,
        finalBalance: runningBalance
    };
};