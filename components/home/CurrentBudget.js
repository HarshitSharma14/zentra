// components/home/CurrentBudget.js
import { useState, useEffect } from 'react';
import { ArrowRight, Target, TrendingUp, Calendar, ToggleLeft, ToggleRight, BarChart3 } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';
import { useRouter } from 'next/navigation';
const CurrentBudget = () => {
    const {
        user,
        transactions,
        budgets,  // Fix: changed from budgetData to budgets
        fetchTransactions,
        getBudgetSummary,
        fetchBudgets,
        getSpentAmounts
    } = useFinanceStore();
    const [isYearlyView, setIsYearlyView] = useState(false);

    // Fetch transactions and budgets when component mounts
    useEffect(() => {
        if (user) {
            fetchBudgets();
            fetchTransactions();
        }
    }, [user, fetchBudgets, fetchTransactions]);

    const router = useRouter();
    // If no user, show placeholder
    if (!user) {
        return (
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-6 lg:p-8 shadow-card">
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

                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        No budget set up yet
                    </p>
                    <button
                        onClick={() => alert('Navigate to budget setup...')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-button hover:shadow-button-hover font-medium"
                    >
                        Set Up Budget
                    </button>
                </div>
            </div>
        );
    }

    // Use proper budget type based on view
    const budgetType = isYearlyView ? 'yearly' : 'monthly';
    const currentBudget = budgets[budgetType];

    // Get budget summary using the proper store function
    const budgetSummary = getBudgetSummary(budgetType);

    // Get spending data
    const { categorySpending } = getSpentAmounts(budgetType);

    // Get top 6 categories by expense amount (actual spending)
    const topCategoriesByExpense = Object.entries(categorySpending)
        .sort(([, spentA], [, spentB]) => spentB - spentA)
        .slice(0, 6);

    // If we have fewer than 6 categories with expenses, include budgeted categories
    const budgetedCategories = Object.keys(currentBudget?.categories || {});
    const allRelevantCategories = new Set([
        ...topCategoriesByExpense.map(([category]) => category),
        ...budgetedCategories.slice(0, 6)
    ]);

    const colors = [
        'bg-gradient-to-r from-blue-500 to-blue-600',
        'bg-gradient-to-r from-green-500 to-green-600',
        'bg-gradient-to-r from-purple-500 to-purple-600',
        'bg-gradient-to-r from-orange-500 to-orange-600',
        'bg-gradient-to-r from-red-500 to-red-600',
        'bg-gradient-to-r from-indigo-500 to-indigo-600'
    ];

    // Create display items prioritizing categories with actual spending
    const budgetItems = Array.from(allRelevantCategories)
        .slice(0, 6)
        .map((category, index) => {
            const spent = categorySpending[category] || 0;
            const budget = currentBudget?.categories?.[category] || 0;
            return {
                category,
                spent,
                budget,
                color: colors[index % colors.length]
            };
        })
        // Sort by spent amount descending to show top spending categories first
        .sort((a, b) => b.spent - a.spent);

    // Use budget summary for accurate calculations
    const totalBudgetUsed = budgetSummary?.totalSpent || 0;
    const totalBudget = budgetSummary?.totalBudgeted || 0;
    const remainingBudget = budgetSummary?.totalRemaining || 0;

    // Days remaining calculation
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Calculate days remaining in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysRemainingInMonth = daysInMonth - currentDate.getDate();

    // Calculate days remaining in current year
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st end of day
    const daysRemainingInYear = Math.ceil((endOfYear - currentDate) / (1000 * 60 * 60 * 24));

    // Helper function to get the appropriate days remaining
    const getDaysRemaining = () => {
        if (isYearlyView) {
            return daysRemainingInYear;
        } else {
            return daysRemainingInMonth;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleClick = () => {
        // TODO: Navigate to budget details/edit page
    };

    // Check if budget is enabled
    const isBudgetEnabled = currentBudget?.enabled;

    return (
        <div
            onClick={handleClick}
            className="bg-card/95 w-full backdrop-blur-xl rounded-3xl border border-border/50 p-6 lg:p-8 cursor-pointer shadow-card hover:shadow-card-hover hover:scale-[1.01] hover:border-primary/20 transition-all group flex flex-col min-h-0"
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

            {/* Detailed Budget Button */}
            <div className="mb-6">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push('/budget');
                    }}
                    className="group flex w-full items-center justify-center space-x-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 transform hover:scale-105 shadow-button hover:shadow-button-hover"
                >
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm font-semibold">Detailed Budget</span>
                    <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
            {/* Budget View Toggle - Moved to top */}
            <div className="mb-6">
                <div className="flex items-center justify-center bg-muted rounded-xl p-1 shadow-card w-fit mx-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsYearlyView(false);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${!isYearlyView
                            ? 'bg-card text-primary shadow-button'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Monthly</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsYearlyView(true);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isYearlyView
                            ? 'bg-card text-primary shadow-button'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Yearly</span>
                    </button>
                </div>
            </div>


            {!isBudgetEnabled ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        No {isYearlyView ? 'yearly' : 'monthly'} budget set up yet
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert('Navigate to budget setup...');
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-button hover:shadow-button-hover font-medium"
                    >
                        Set Up {isYearlyView ? 'Yearly' : 'Monthly'} Budget
                    </button>
                </div>
            ) : (
                <>
                    {/* Budget Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        Budget Remaining
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

                        <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Days Remaining
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {getDaysRemaining()} days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Categories by Expense */}
                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Top Categories by Spending
                        </p>

                        {budgetItems.length > 0 ? budgetItems.map((item, index) => {
                            const percentage = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
                            const isOverBudget = percentage > 100;

                            return (
                                <div key={index} className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary/70 transition-all duration-300 shadow-card hover:shadow-card-hover hover:scale-[1.01]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {item.category}
                                        </span>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(item.spent)} {item.budget > 0 && `/ ${formatCurrency(item.budget)}`}
                                            </span>
                                            {item.budget > 0 && (
                                                <p className={`text-xs ${isOverBudget
                                                    ? 'text-red-600 dark:text-red-400 font-semibold'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {isOverBudget
                                                        ? `${formatCurrency(item.spent - item.budget)} over budget`
                                                        : `${formatCurrency(item.budget - item.spent)} remaining`
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar - only show if budget is set */}
                                    {item.budget > 0 && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    No spending data for this period
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div onClick={() => router.push("/budget")} className="mt-auto pt-4 border-t border-border/50 flex justify-center">
                <p className="text-center text-sm text-muted-foreground">
                    Click to view detailed budget breakdown
                </p>
            </div>
        </div>
    );
};

export default CurrentBudget;