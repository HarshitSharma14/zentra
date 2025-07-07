// utils/chartUtils.js

/**
 * Generate colors for pie chart data
 */
export const generateChartColors = (count) => {
    const colors = [
        'hsl(210, 70%, 50%)', // Blue
        'hsl(120, 70%, 50%)', // Green  
        'hsl(270, 70%, 50%)', // Purple
        'hsl(30, 70%, 50%)',  // Orange
        'hsl(0, 70%, 50%)',   // Red
        'hsl(240, 70%, 50%)', // Indigo
        'hsl(180, 70%, 50%)', // Cyan
        'hsl(300, 70%, 50%)', // Magenta
        'hsl(60, 70%, 50%)',  // Yellow
        'hsl(330, 70%, 50%)', // Pink
    ];

    return Array.from({ length: count }, (_, index) =>
        colors[index % colors.length]
    );
};

/**
 * Category color mapping for consistent colors
 */
export const getCategoryColor = (category, index) => {
    const categoryColors = {
        'Food & Dining': 'hsl(0, 70%, 50%)',      // Red
        'Transportation': 'hsl(210, 70%, 50%)',   // Blue
        'Shopping': 'hsl(270, 70%, 50%)',         // Purple
        'Bills & Utilities': 'hsl(30, 70%, 50%)', // Orange
        'Entertainment': 'hsl(120, 70%, 50%)',    // Green
        'Healthcare': 'hsl(180, 70%, 50%)',       // Cyan
        'Education': 'hsl(240, 70%, 50%)',        // Indigo
        'Travel': 'hsl(300, 70%, 50%)',           // Magenta
        'Income': 'hsl(60, 70%, 50%)',            // Yellow
        'Other': 'hsl(330, 70%, 50%)',            // Pink
    };

    return categoryColors[category] || `hsl(${index * 45}, 70%, 50%)`;
};

/**
 * Format pie chart data with colors
 */
export const formatPieChartData = (categoryBreakdown) => {
    if (!Array.isArray(categoryBreakdown) || categoryBreakdown.length === 0) {
        return [];
    }

    const colors = generateChartColors(categoryBreakdown.length);

    return categoryBreakdown.map((item, index) => ({
        ...item,
        color: colors[index],
        fill: colors[index]
    }));
};

/**
 * Format bar chart data for trends
 */
export const formatBarChartData = (monthlyTrends) => {
    if (!Array.isArray(monthlyTrends) || monthlyTrends.length === 0) {
        return [];
    }

    return monthlyTrends.map(trend => ({
        ...trend,
        name: trend.monthName,
        value: trend.amount,
        fill: 'hsl(120, 70%, 50%)' // Green for all bars
    }));
};

/**
 * Format currency with proper locale
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format percentage with + or - sign
 */
export const formatPercentage = (percentage) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
};

/**
 * Get color class for percentage change
 */
export const getPercentageColor = (percentage) => {
    if (percentage > 0) {
        return 'text-red-600 dark:text-red-400'; // Spending increased (bad)
    } else if (percentage < 0) {
        return 'text-green-600 dark:text-green-400'; // Spending decreased (good)
    }
    return 'text-gray-600 dark:text-gray-400'; // No change
};

/**
 * Truncate category names for display
 */
export const truncateCategory = (category, maxLength = 15) => {
    if (!category || category.length <= maxLength) {
        return category;
    }
    return category.substring(0, maxLength) + '...';
};