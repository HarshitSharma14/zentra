// pages/transactions/index.js or components/transactions/TransactionHistoryPage.js
'use client';
import { useEffect, useState } from 'react';
import {
    Plus,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Search,
    Filter
} from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';
import TransactionList from '@/components/transaction/transactionList';
import AddTransactionDialog from '@/components/home/AddTransactionDialog';
import { useRouter } from 'next/navigation';
const TransactionHistoryPage = () => {
    const { summaryData, user, initializeUser, fetchTransactions, transactions, loading, setNavigationItems } = useFinanceStore();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
    const router = useRouter();
    useEffect(() => {
        try {
            if (!user) {
                initializeUser('/transactions'); // Pass current path for proper redirect handling
            }
            setNavigationItems([
                { name: 'Dashboard', href: '/', active: false },
                { name: 'Transactions', href: '/transactions', active: true },
                { name: 'Budgets', href: '/budget', active: false },
            ]);
            if (user) {
                fetchTransactions();
            }
        } catch (error) {
            console.error('Error initializing user:', error);
            router.replace('/');
        }

    }, [user, fetchTransactions])


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleAddTransactionSuccess = () => {
        setShowAddDialog(false);
        // Transactions will be automatically updated by the slice
    };

    if (loading.transactions || (!user)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto mb-6"></div>
                        <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Loading Zentra Finance
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading your transaction history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto p-6">

                {/* Total Money Box & Add Button */}
                <div className="mb-8">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">

                        {/* Total Balance Display */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                                <DollarSign className="h-8 w-8 text-white" />
                            </div>

                            <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Total Balance
                            </h1>

                            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                                {formatCurrency(summaryData?.totalBalance || 0)}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700/50">
                                    <div className="flex items-center justify-center space-x-2">
                                        <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Monthly Income</span>
                                    </div>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                                        {formatCurrency(summaryData?.monthlyIncome || 0)}
                                    </p>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-700/50">
                                    <div className="flex items-center justify-center space-x-2">
                                        <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        <span className="text-sm font-medium text-red-700 dark:text-red-300">Monthly Expenses</span>
                                    </div>
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                        {formatCurrency(summaryData?.monthlySpent || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Add Transaction Button */}
                        <div className="text-center">
                            <button
                                onClick={() => setShowAddDialog(true)}
                                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <Plus className="h-6 w-6" />
                                <span>Add Transaction</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">All Transactions</option>
                                    <option value="income">Income Only</option>
                                    <option value="expense">Expenses Only</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction List Component */}
                <TransactionList
                    showHeader={true}
                    showLoadMore={true}
                    searchQuery={searchQuery}
                    filterType={filterType}
                />
            </div>

            {/* Add Transaction Dialog */}
            <AddTransactionDialog
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onSuccess={handleAddTransactionSuccess}
            />
        </div>
    );
};

export default TransactionHistoryPage;