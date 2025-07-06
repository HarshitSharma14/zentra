// lib/mockTransactions.js

/**
 * 50 Mock transactions template (without dates)
 * Realistic and diverse spending patterns with income and expenses
 */
export const MOCK_TRANSACTIONS = [
    // Income transactions (more varied)
    { amount: 5200.00, category: "Income", description: "Monthly salary - Tech Co" },
    { amount: 4950.00, category: "Income", description: "Monthly salary - Tech Co" },
    { amount: 5100.00, category: "Income", description: "Monthly salary - Tech Co" },
    { amount: 650.00, category: "Income", description: "Freelance web development" },
    { amount: 420.00, category: "Income", description: "Side gig - tutoring" },
    { amount: 280.00, category: "Income", description: "Sold old furniture" },
    { amount: 150.00, category: "Income", description: "Cashback & rewards" },
    { amount: 75.00, category: "Income", description: "Investment dividends" },

    // Bills & Utilities (more realistic breakdown)
    { amount: -1350.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -1350.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -1350.00, category: "Bills & Utilities", description: "Monthly rent" },
    { amount: -156.80, category: "Bills & Utilities", description: "Electricity bill" },
    { amount: -89.45, category: "Bills & Utilities", description: "Water & sewage" },
    { amount: -195.60, category: "Bills & Utilities", description: "Gas heating" },
    { amount: -85.99, category: "Bills & Utilities", description: "Internet & WiFi" },
    { amount: -65.00, category: "Bills & Utilities", description: "Mobile phone plan" },
    { amount: -45.99, category: "Bills & Utilities", description: "Streaming services" },

    // Food & Dining (more variety)
    { amount: -142.85, category: "Food & Dining", description: "Whole Foods groceries" },
    { amount: -98.30, category: "Food & Dining", description: "Trader Joe's shopping" },
    { amount: -67.45, category: "Food & Dining", description: "Local market produce" },
    { amount: -156.70, category: "Food & Dining", description: "Costco bulk shopping" },
    { amount: -89.25, category: "Food & Dining", description: "Weekly groceries" },
    { amount: -125.80, category: "Food & Dining", description: "Organic grocery run" },
    { amount: -78.50, category: "Food & Dining", description: "Asian grocery store" },
    { amount: -95.40, category: "Food & Dining", description: "Weekend groceries" },
    { amount: -45.75, category: "Food & Dining", description: "Italian restaurant" },
    { amount: -32.20, category: "Food & Dining", description: "Sushi lunch" },
    { amount: -28.95, category: "Food & Dining", description: "Coffee & pastries" },
    { amount: -65.30, category: "Food & Dining", description: "Brunch with friends" },
    { amount: -18.50, category: "Food & Dining", description: "Food truck tacos" },
    { amount: -85.60, category: "Food & Dining", description: "Date night dinner" },

    // Transportation (diverse options)
    { amount: -52.75, category: "Transportation", description: "Shell gas station" },
    { amount: -48.90, category: "Transportation", description: "Chevron fuel" },
    { amount: -45.20, category: "Transportation", description: "BP gas fill-up" },
    { amount: -35.50, category: "Transportation", description: "Uber rides" },
    { amount: -28.75, category: "Transportation", description: "Lyft to airport" },
    { amount: -15.00, category: "Transportation", description: "Public transit pass" },
    { amount: -220.00, category: "Transportation", description: "Car maintenance" },
    { amount: -85.99, category: "Transportation", description: "Parking fees" },

    // Shopping (more categories)
    { amount: -299.99, category: "Shopping", description: "Winter coat - Nordstrom" },
    { amount: -156.75, category: "Shopping", description: "Nike sneakers" },
    { amount: -89.50, category: "Shopping", description: "Home decor - Target" },
    { amount: -445.00, category: "Shopping", description: "iPhone accessories" },
    { amount: -125.30, category: "Shopping", description: "Books & supplies" },
    { amount: -78.99, category: "Shopping", description: "Skincare products" },
    { amount: -195.50, category: "Shopping", description: "Workout gear" },
    { amount: -65.75, category: "Shopping", description: "Amazon purchases" },

    // Entertainment (varied activities)
    { amount: -45.00, category: "Entertainment", description: "Movie theater tickets" },
    { amount: -125.50, category: "Entertainment", description: "Concert - local venue" },
    { amount: -85.75, category: "Entertainment", description: "Mini golf & drinks" },
    { amount: -35.20, category: "Entertainment", description: "Bowling night" },
    { amount: -65.80, category: "Entertainment", description: "Escape room activity" },
    { amount: -28.50, category: "Entertainment", description: "Board game cafe" },
    { amount: -95.00, category: "Entertainment", description: "Comedy show tickets" },

    // Healthcare (comprehensive)
    { amount: -185.00, category: "Healthcare", description: "Dental cleaning" },
    { amount: -45.75, category: "Healthcare", description: "Prescription medication" },
    { amount: -125.00, category: "Healthcare", description: "Eye doctor visit" },
    { amount: -85.50, category: "Healthcare", description: "Physical therapy" },
    { amount: -35.99, category: "Healthcare", description: "Vitamins & supplements" },

    // Education & Professional
    { amount: -89.99, category: "Education", description: "Online course - Udemy" },
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
 */
export const generateMonthlyBudget = () => {
    return {
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
};

/**
 * Generate yearly budget based on monthly budget
 */
export const generateYearlyBudget = () => {
    const monthlyBudget = generateMonthlyBudget();
    const yearlyBudget = {};

    Object.entries(monthlyBudget).forEach(([category, amount]) => {
        yearlyBudget[category] = amount * 12;
    });

    return yearlyBudget;
};