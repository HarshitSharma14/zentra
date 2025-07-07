// components/budget/BudgetPage.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Target,
    Plus,
    Edit3,
    Trash2,
    TrendingUp,
    TrendingDown,
    Calendar,
    IndianRupee,
    PieChart,
    AlertTriangle,
    CheckCircle,
    RotateCcw
} from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';
import BudgetDialog from './BudgetDialog';
import LoadingScreen from '@/components/ui/LoadingScreen';

const BudgetPage = () => {
    const router = useRouter();
    const {
        user,
        initializeUser,
        loading,
        setNavigationItems,
        fetchBudgets,
        budgets,
        getBudgetSummary,
        deleteBudget,
        fetchTransactions
    } = useFinanceStore();

    const [showBudgetDialog, setShowBudgetDialog] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        type: 'monthly', // 'monthly' or 'yearly'
        mode: 'create' // 'create' or 'edit'
    });

    useEffect(() => {
        try {
            if (!user) {
                initializeUser('/budget'); // Pass current path for proper redirect handling
            }
            setNavigationItems([
                { name: 'Dashboard', href: '/', active: false },
                { name: 'Transactions', href: '/transactions', active: false },
                { name: 'Budgets', href: '/budget', active: true },
            ]);
            if (user) {
                fetchBudgets();
                fetchTransactions(); // Need transactions for spent calculations
            }
        } catch (error) {
            console.error('Error initializing budget page:', error);
            router.replace('/');
        }
    }, [user, fetchBudgets, fetchTransactions, initializeUser, setNavigationItems, router]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleCreateBudget = (type) => {
        setDialogConfig({ type, mode: 'create' });
        setShowBudgetDialog(true);
    };

    const handleEditBudget = (type) => {
        setDialogConfig({ type, mode: 'edit' });
        setShowBudgetDialog(true);
    };

    const handleDeleteBudget = async (type) => {
        if (window.confirm(`Are you sure you want to delete your ${type} budget?`)) {
            const result = await deleteBudget(type);
            if (result.success) {
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} budget deleted successfully!`);
            } else {
                alert(`Failed to delete ${type} budget: ${result.message}`);
            }
        }
    };

    const handleBudgetDialogSuccess = () => {
        setShowBudgetDialog(false);
        fetchBudgets(); // Refresh budgets after successful operation
    };

    // Get budget summaries
    const monthlySummary = getBudgetSummary('monthly');
    const yearlySummary = getBudgetSummary('yearly');

    const renderBudgetCard = (type, summary) => {
        const isMonthly = type === 'monthly';
        const title = isMonthly ? 'Monthly Budget' : 'Yearly Budget';
        const period = isMonthly ? 'This Month' : 'This Year';

        if (!summary) {
            // No budget configured
            return (
                <div className="bg-white/80 w-[85%] dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 lg:p-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            No {type} budget configured yet
                        </p>
                        <button
                            onClick={() => handleCreateBudget(type)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 mx-auto"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Create {title}</span>
                        </button>
                    </div>
                </div>
            );
        }

        const progressColor = summary.isOverBudget
            ? 'from-red-500 to-red-600'
            : summary.totalPercentage > 80
                ? 'from-yellow-500 to-orange-500'
                : 'from-green-500 to-green-600';

        const progressWidth = Math.min(summary.totalPercentage, 100);

        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className={`px-6 lg:px-8 py-6 bg-gradient-to-r ${progressColor} text-white relative overflow-hidden`}>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Target className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{title}</h3>
                                    <p className="text-sm opacity-90">{period}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleEditBudget(type)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    title="Edit Budget"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteBudget(type)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                    title="Delete Budget"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                </div>

                {/* Budget Overview */}
                <div className="p-6 lg:p-8">
                    {/* Total Budget Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Total Budget Progress
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {summary.totalPercentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500 ease-out`}
                                style={{ width: `${progressWidth}%` }}
                            ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Spent: {formatCurrency(summary.totalSpent)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                                Budget: {formatCurrency(summary.totalBudgeted)}
                            </span>
                        </div>
                    </div>

                    {/* Budget Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <IndianRupee className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                        Remaining
                                    </p>
                                    <p className="text-lg font-bold text-green-800 dark:text-green-200">
                                        {formatCurrency(summary.totalRemaining)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <PieChart className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        Categories
                                    </p>
                                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                                        {Object.keys(summary.categoryProgress).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Category Breakdown
                        </h4>
                        <div className="space-y-3">
                            {Object.entries(summary.categoryProgress).map(([category, progress]) => (
                                <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {category}
                                            </span>
                                            {progress.isOverBudget && (
                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                            {progress.percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${progress.isOverBudget
                                                ? 'bg-red-500'
                                                : progress.percentage > 80
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        <span>Spent: {formatCurrency(progress.spent)}</span>
                                        <span>Budget: {formatCurrency(progress.budgeted)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auto-renew indicator */}
                    {summary.autoRenew && (
                        <div className="mt-6 flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                            <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                Auto-renew enabled for next {type === 'monthly' ? 'month' : 'year'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading.user || loading.budgets) {
        return (
            <LoadingScreen
                title="Loading Budgets"
                description="Preparing your budget overview..."
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Budget Overview
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track and manage your spending limits
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <span className="text-gray-700 dark:text-gray-300">Back to Dashboard</span>
                        </button>
                    </div>
                </div>

                {/* Budget Cards Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Monthly Budget */}
                    {renderBudgetCard('monthly', monthlySummary)}

                    {/* Yearly Budget */}
                    {renderBudgetCard('yearly', yearlySummary)}
                </div>
            </div>

            {/* Budget Dialog */}
            <BudgetDialog
                open={showBudgetDialog}
                onClose={() => setShowBudgetDialog(false)}
                onSuccess={handleBudgetDialogSuccess}
                budgetType={dialogConfig.type}
                mode={dialogConfig.mode}
            />
        </div>
    );
};

export default BudgetPage;