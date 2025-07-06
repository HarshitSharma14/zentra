// lib/mockTransactions.js

// Mock transactions data - expenses as negative, income as positive
export const MOCK_TRANSACTIONS = [
    // Income Transactions (positive amounts)
    { amount: 4500.00, category: "Income", description: "Monthly salary" },
    { amount: 1200.00, category: "Freelance", description: "Web development project" },
    { amount: 300.50, category: "Investment", description: "Stock dividend" },
    { amount: 150.00, category: "Gift", description: "Birthday money" },
    { amount: 4500.00, category: "Income", description: "Monthly salary" },
    { amount: 850.00, category: "Freelance", description: "Logo design work" },
    { amount: 275.00, category: "Investment", description: "Cryptocurrency gains" },
    { amount: 4500.00, category: "Income", description: "Monthly salary" },
    { amount: 980.00, category: "Freelance", description: "Mobile app consulting" },
    { amount: 320.75, category: "Investment", description: "Bond interest" },
    { amount: 200.00, category: "Other Income", description: "Tax refund" },

    // Food & Dining Expenses (negative amounts)
    { amount: -125.45, category: "Food & Dining", description: "Grocery shopping at Whole Foods" },
    { amount: -89.50, category: "Food & Dining", description: "Dinner at Italian restaurant" },
    { amount: -45.75, category: "Food & Dining", description: "Weekly groceries" },
    { amount: -67.20, category: "Food & Dining", description: "Lunch meeting" },
    { amount: -156.80, category: "Food & Dining", description: "Weekly meal prep groceries" },
    { amount: -78.95, category: "Food & Dining", description: "Date night dinner" },
    { amount: -34.50, category: "Food & Dining", description: "Coffee and pastries" },
    { amount: -145.30, category: "Food & Dining", description: "Monthly grocery haul" },
    { amount: -92.75, category: "Food & Dining", description: "Weekend brunch" },
    { amount: -58.25, category: "Food & Dining", description: "Takeout sushi" },

    // Transportation Expenses
    { amount: -95.00, category: "Transportation", description: "Gas fill-up" },
    { amount: -45.50, category: "Transportation", description: "Parking fees downtown" },
    { amount: -125.75, category: "Transportation", description: "Car maintenance" },
    { amount: -85.00, category: "Transportation", description: "Gas and car wash" },
    { amount: -67.25, category: "Transportation", description: "Uber rides this week" },
    { amount: -189.50, category: "Transportation", description: "Car insurance payment" },
    { amount: -78.00, category: "Transportation", description: "Metro monthly pass" },

    // Bills & Utilities
    { amount: -1245.00, category: "Bills & Utilities", description: "Monthly rent payment" },
    { amount: -156.75, category: "Bills & Utilities", description: "Electricity bill" },
    { amount: -89.50, category: "Bills & Utilities", description: "Internet and cable" },
    { amount: -67.25, category: "Bills & Utilities", description: "Water and sewage" },
    { amount: -45.00, category: "Bills & Utilities", description: "Phone bill" },
    { amount: -1245.00, category: "Bills & Utilities", description: "Monthly rent payment" },
    { amount: -134.85, category: "Bills & Utilities", description: "Gas and electricity" },
    { amount: -89.50, category: "Bills & Utilities", description: "Internet service" },
    { amount: -1245.00, category: "Bills & Utilities", description: "Monthly rent payment" },
    { amount: -178.90, category: "Bills & Utilities", description: "Utility bills" },

    // Shopping
    { amount: -234.99, category: "Shopping", description: "New winter jacket" },
    { amount: -89.75, category: "Shopping", description: "Books and magazines" },
    { amount: -156.50, category: "Shopping", description: "Household supplies" },
    { amount: -345.80, category: "Shopping", description: "New laptop accessories" },
    { amount: -78.25, category: "Shopping", description: "Clothing shopping" },
    { amount: -145.60, category: "Shopping", description: "Home decor items" },

    // Entertainment
    { amount: -125.00, category: "Entertainment", description: "Concert tickets" },
    { amount: -45.75, category: "Entertainment", description: "Movie night" },
    { amount: -89.50, category: "Entertainment", description: "Gaming subscription" },
    { amount: -67.25, category: "Entertainment", description: "Streaming services" },
    { amount: -156.80, category: "Entertainment", description: "Weekend activities" },
    { amount: -78.95, category: "Entertainment", description: "Board game purchase" },

    // Healthcare
    { amount: -175.00, category: "Healthcare", description: "Doctor visit copay" },
    { amount: -89.50, category: "Healthcare", description: "Prescription medications" },
    { amount: -245.75, category: "Healthcare", description: "Dental cleaning" },
    { amount: -67.25, category: "Healthcare", description: "Vitamins and supplements" },
    { amount: -156.80, category: "Healthcare", description: "Physical therapy session" },

    // Education
    { amount: -299.99, category: "Education", description: "Online course - Udemy" },
    { amount: -45.00, category: "Education", description: "Technical books" },
    { amount: -125.00, category: "Education", description: "Professional workshop" },

    // Travel & Vacation
    { amount: -350.00, category: "Travel", description: "Weekend getaway hotel" },
    { amount: -125.50, category: "Travel", description: "Flight booking" },
    { amount: -65.75, category: "Travel", description: "Vacation dining" },

    // Gifts & Charity
    { amount: -95.00, category: "Gifts", description: "Birthday gift" },
    { amount: -50.00, category: "Gifts", description: "Charity donation" },
    { amount: -75.25, category: "Gifts", description: "Holiday present" },

    // Personal Care
    { amount: -85.00, category: "Personal Care", description: "Haircut & styling" },
    { amount: -45.50, category: "Personal Care", description: "Spa treatment" },

    // Miscellaneous
    { amount: -25.99, category: "Other", description: "Bank fees" },
    { amount: -156.80, category: "Other", description: "Emergency repair" },
    { amount: -35.75, category: "Other", description: "Pet supplies" }
];

/**
 * Generate dates: transactions spread more randomly over 3 months
 */
export const generateDates = (count) => {
    const dates = [];
    const today = new Date();

    // Generate more random dates over the past 90 days
    for (let i = 0; i < count; i++) {
        const daysBack = Math.floor(Math.random() * 90) + 1; // 1-90 days ago
        const transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - daysBack);

        // Add some randomness to the time of day
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        transactionDate.setHours(randomHour, randomMinute, 0, 0);

        dates.push(transactionDate);
    }

    return dates.sort((a, b) => a - b); // Sort chronologically
};

/**
 * Prepare mock transactions with dates and running balance
 */
export const prepareMockTransactions = (userId) => {
    const dates = generateDates(MOCK_TRANSACTIONS.length);
    let runningBalance = 0;
    const transactions = [];

    // Shuffle transactions for more realistic pattern
    const shuffledTransactions = [...MOCK_TRANSACTIONS].sort(() => Math.random() - 0.5);

    shuffledTransactions.forEach((transaction, index) => {
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

    // Sort by date for final output
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
        transactions,
        finalBalance: runningBalance
    };
};

/**
 * Generate monthly budget based on transaction patterns
 * Returns object with both categories and totalBudget
 */
export const generateMonthlyBudget = () => {
    const categories = {
        'Food & Dining': 800,
        'Bills & Utilities': 1200,
        'Transportation': 400,
        'Shopping': 600,
        'Entertainment': 300,
        'Healthcare': 350,
        'Education': 200,
        'Travel': 500,
        'Gifts': 150,
        'Personal Care': 200,
        'Other': 250
    };

    // Calculate total budget from categories
    const totalBudget = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

    return {
        categories,
        totalBudget
    };
};

/**
 * Generate yearly budget based on monthly budget
 * Returns object with both categories and totalBudget
 */
export const generateYearlyBudget = () => {
    const monthlyBudget = generateMonthlyBudget();
    const categories = {};

    Object.entries(monthlyBudget.categories).forEach(([category, amount]) => {
        categories[category] = amount * 12;
    });

    // Calculate total yearly budget
    const totalBudget = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

    return {
        categories,
        totalBudget
    };
};