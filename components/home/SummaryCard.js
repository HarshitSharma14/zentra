// components/home/SummaryCard.js
import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, History, Calendar, Eye } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';
import { useRouter } from 'next/navigation';
const SummaryCard = ({ onAddTransaction }) => {
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'yearly'
    const router = useRouter();
    const { summaryData } = useFinanceStore();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Mock yearly data - replace with real data later
    const yearlyData = {
        totalIncome: summaryData.yearlyIncome,
        totalSpent: summaryData.yearlySpent
    };

    const currentData = viewMode === 'monthly'
        ? { income: summaryData.monthlyIncome, spent: summaryData.monthlySpent }
        : { income: yearlyData.totalIncome, spent: yearlyData.totalSpent };

    const savingsRate = currentData.income > 0
        ? ((currentData.income - currentData.spent) / currentData.income * 100).toFixed(1)
        : 0;

    return (
        <div className="mb-8">
            <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-8 lg:p-10 shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01] hover:border-primary/20">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">

                    {/* Total Balance - Hero Section */}
                    <div className="xl:col-span-4 text-center xl:text-left">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide uppercase">
                                    Total Balance
                                </p>
                                <p className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                                    {formatCurrency(summaryData.totalBalance)}
                                </p>
                            </div>


                        </div>
                    </div>

                    {/* Income & Expenses Section */}
                    <div className="xl:col-span-5">
                        {/* Period Toggle */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-muted rounded-2xl p-1.5 flex shadow-card">
                                <button
                                    onClick={() => setViewMode('monthly')}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${viewMode === 'monthly'
                                        ? 'bg-card text-primary shadow-button transform scale-105'
                                        : 'text-muted-foreground hover:text-primary'
                                        }`}
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span>This Month</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('yearly')}
                                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${viewMode === 'yearly'
                                        ? 'bg-card text-primary shadow-button transform scale-105'
                                        : 'text-muted-foreground hover:text-primary'
                                        }`}
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span>This Year</span>
                                </button>
                            </div>
                        </div>

                        {/* Income & Expense Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Income Card */}
                            <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300">
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Income
                                            </p>
                                            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                                                {formatCurrency(currentData.income)}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-12 -mt-12"></div>
                            </div>

                            {/* Expenses Card */}
                            <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300">
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <TrendingDown className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                                                {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Expenses
                                            </p>
                                            <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                                                {formatCurrency(currentData.spent)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-full -mr-12 -mt-12"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="xl:col-span-3 flex flex-col space-y-4">
                        {/* Add Transaction - Primary Button */}
                        <button
                            onClick={onAddTransaction}
                            className="group relative w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-button hover:shadow-button-hover transform hover:scale-105 overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-center space-x-3">
                                <Plus className="h-5 w-5" />
                                <span>Add Transaction</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        {/* View History - Secondary Button */}
                        <button
                            onClick={() => router.push('/transactions')}
                            className="group w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-border hover:border-primary/30 shadow-button hover:shadow-button-hover hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-center space-x-3">
                                <Eye className="h-5 w-5" />
                                <span>View History</span>
                            </div>
                        </button>

                        {/* Quick Stats */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;