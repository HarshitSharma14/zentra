// components/home/CurrentBudget.js
import { ArrowRight } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const CurrentBudget = () => {
    const { user, transactions } = useFinanceStore();

    // If no user or no monthly budget enabled, show placeholder
    if (!user || !user.monthlyBudget.enabled) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Current Budget
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No budget set up yet
                    </p>
                    <button
                        onClick={() => alert('Navigate to budget setup...')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Set Up Budget
                    </button>
                </div>
            </div>
        );
    }

    // Calculate current month spending by category
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlySpending = {};

    // Get spending for current month by category
    transactions
        ?.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear &&
                tx.amount < 0; // Only expenses
        })
        .forEach(tx => {
            const category = tx.category;
            if (!monthlySpending[category]) {
                monthlySpending[category] = 0;
            }
            monthlySpending[category] += Math.abs(tx.amount);
        });

    // Create budget data with spending
    const budgetData = [];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];

    Object.entries(user.monthlyBudget.categories).forEach(([category, budget], index) => {
        const spent = monthlySpending[category] || 0;
        budgetData.push({
            category,
            spent,
            budget,
            color: colors[index % colors.length]
        });
    });

    const totalBudgetUsed = budgetData.reduce((sum, item) => sum + item.spent, 0);
    const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
    const remainingBudget = totalBudget - totalBudgetUsed;

    // Days remaining in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysRemaining = daysInMonth - currentDate.getDate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleClick = () => {
        // TODO: Navigate to budget details/edit page
        alert('Opening budget details...');
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-all group"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Current Budget
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Budget Remaining
                    </p>
                    <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(remainingBudget)}
                    </p>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Days Remaining
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {daysRemaining} days
                    </p>
                </div>
            </div>

            {/* Category Progress */}
            <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category Budget Status
                </p>
                {budgetData.slice(0, 6).map((item, index) => {
                    const percentage = (item.spent / item.budget) * 100;
                    const isOverBudget = percentage > 100;

                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.category}
                                </span>
                                <span className={`text-sm ${isOverBudget
                                    ? 'text-red-600 dark:text-red-400 font-semibold'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {isOverBudget
                                        ? `${formatCurrency(item.spent - item.budget)} over`
                                        : `${formatCurrency(item.budget - item.spent)} left`
                                    }
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${isOverBudget
                                        ? 'bg-red-500 dark:bg-red-400'
                                        : item.color
                                        }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>
                            {isOverBudget && (
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {Math.round(percentage)}% of budget used
                                </p>
                            )}
                        </div>
                    );
                })}

                {budgetData.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No budget categories set up
                    </p>
                )}
            </div>
        </div>
    );
};

export default CurrentBudget;