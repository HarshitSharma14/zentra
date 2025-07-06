// components/home/CurrentBudget.js
import { useState, useEffect } from 'react';
import { ArrowRight, Target, TrendingUp, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const CurrentBudget = () => {
    const { user, transactions, budgetData, fetchTransactions } = useFinanceStore();
    const [isYearlyView, setIsYearlyView] = useState(false);

    // Fetch transactions when component mounts
    useEffect(() => {
        if (user && transactions.length === 0) {
            fetchTransactions();
        }
    }, [user, fetchTransactions, transactions.length]);

    // If no user, show placeholder
    if (!user) {
        return (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Current Budget
                        </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        No budget set up yet
                    </p>
                    <button
                        onClick={() => alert('Navigate to budget setup...')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                    >
                        Set Up Budget
                    </button>
                </div>
            </div>
        );
    }

    // Calculate spending by category based on view type
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const categorySpending = {};

    // Get spending for the selected time period by category
    transactions
        ?.filter(tx => {
            const txDate = new Date(tx.date);
            if (isYearlyView) {
                // For yearly view, get all expenses from current year
                return txDate.getFullYear() === currentYear && tx.amount < 0;
            } else {
                // For monthly view, get all expenses from current month
                return txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear &&
                    tx.amount < 0;
            }
        })
        .forEach(tx => {
            const category = tx.category;
            if (!categorySpending[category]) {
                categorySpending[category] = 0;
            }
            categorySpending[category] += Math.abs(tx.amount);
        });

    // Use actual budget data from store based on view type
    const budgetCategories = isYearlyView
        ? (budgetData?.yearlyBudget?.categories || {})
        : (budgetData?.monthlyBudget?.categories || {});

    const colors = [
        'bg-gradient-to-r from-blue-500 to-blue-600',
        'bg-gradient-to-r from-green-500 to-green-600',
        'bg-gradient-to-r from-purple-500 to-purple-600',
        'bg-gradient-to-r from-orange-500 to-orange-600',
        'bg-gradient-to-r from-red-500 to-red-600',
        'bg-gradient-to-r from-indigo-500 to-indigo-600'
    ];

    // First, sort ALL categories by expense amount (descending)
    const sortedCategoriesByExpense = Object.entries(categorySpending)
        .sort(([, spentA], [, spentB]) => spentB - spentA);

    // If we have fewer than 6 categories with expenses, fill with budgeted categories
    const allCategories = new Set([
        ...sortedCategoriesByExpense.map(([category]) => category),
        ...Object.keys(budgetCategories)
    ]);

    const budgetItems = Array.from(allCategories)
        .slice(0, 6)
        .map((category, index) => {
            const spent = categorySpending[category] || 0;
            const budget = budgetCategories[category] || 0;
            return {
                category,
                spent,
                budget,
                color: colors[index % colors.length]
            };
        })
        .sort((a, b) => b.spent - a.spent); // Sort by spent amount descending

    const totalBudgetUsed = budgetItems.reduce((sum, item) => sum + item.spent, 0);
    const totalBudget = budgetItems.reduce((sum, item) => sum + item.budget, 0);
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
            className="bg-white/70 w-full dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-6 lg:p-8 cursor-pointer hover:shadow-xl transition-all group shadow-2xl"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Current Budget
                    </h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Budget View Toggle */}
            <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                        onClick={() => setIsYearlyView(false)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${!isYearlyView
                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Monthly</span>
                    </button>
                    <button
                        onClick={() => setIsYearlyView(true)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isYearlyView
                            ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Yearly</span>
                    </button>
                </div>
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                {isYearlyView ? 'Yearly Budget Remaining' : 'Budget Remaining'}
                            </p>
                            <p className={`text-2xl font-bold ${remainingBudget >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {formatCurrency(remainingBudget)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                {isYearlyView ? 'Days Remaining in Year' : 'Days Remaining in Month'}
                            </p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {isYearlyView
                                    ? Math.ceil((new Date(currentYear + 1, 0, 1) - currentDate) / (1000 * 60 * 60 * 24))
                                    : daysRemaining
                                } days
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Progress */}
            <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {isYearlyView ? 'Yearly Budget Status' : 'Monthly Budget Status'}
                </p>

                {budgetItems.slice(0, 6).map((item, index) => {
                    const percentage = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
                    const isOverBudget = percentage > 100;

                    return (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {item.category}
                                </span>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                                    </span>
                                    <p className={`text-xs ${isOverBudget
                                        ? 'text-red-600 dark:text-red-400 font-semibold'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {isOverBudget
                                            ? `${formatCurrency(item.spent - item.budget)} over budget`
                                            : `${formatCurrency(item.budget - item.spent)} remaining`
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${isOverBudget
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : item.color
                                        }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>

                            {/* Percentage */}
                            <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs font-medium ${isOverBudget
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    {Math.round(percentage)}% used
                                </span>
                                {isOverBudget && (
                                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
                                        Over Budget
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {budgetItems.length === 0 && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            No budget categories set up
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Click to view detailed budget breakdown
                </p>
            </div>
        </div>
    );
};

export default CurrentBudget;