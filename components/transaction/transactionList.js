// components/transactions/TransactionList.js
import { useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, Plus } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';
import { formatCurrency } from '@/utils/chartUtils';
import { formatDateForDisplay, getRelativeTime } from '@/utils/dateUtils';
import InfiniteScroll from 'react-infinite-scroll-component';

const TransactionList = ({
    showHeader = true,
    showLoadMore = true,
    searchQuery = '',
    filterType = 'all'
}) => {
    const {
        user,
        transactions,
        hasMore,
        loading,
        fetchTransactions,
        loadMoreTransactions
    } = useFinanceStore();

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesSearch = transaction?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction?.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' ||
                (filterType === 'income' && transaction.amount > 0) ||
                (filterType === 'expense' && transaction.amount < 0);

            return matchesSearch && matchesType;
        });
    }, [transactions, searchQuery, filterType]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateString);
    };

    if (loading.transactions && transactions.length === 0) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                {showHeader && (
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Transaction History
                        </h3>
                    </div>
                )}
                <div className="p-8">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                </div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
            {showHeader && (
                <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Transaction History
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{filteredTransactions.length} transactions</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.length > 0 ? (
                    <>
                        {console.log(transactions)}
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    {/* Transaction Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.amount > 0
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-red-100 dark:bg-red-900/30'
                                        }`}>
                                        {transaction.amount > 0 ? (
                                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                                        )}
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {transaction.category}
                                                </p>
                                                {transaction?.description && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                                                        {transaction.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{getRelativeTime(transaction.date)}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatDate(transaction.date)}</span>
                                                </div>
                                            </div>

                                            <div className="text-right ml-4">
                                                <p className={`text-lg font-semibold ${transaction.amount > 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Balance: {formatCurrency(transaction.runningBalance)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Load More Button
                        {showLoadMore && hasMore && (
                            <div className="p-6 text-center border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={loadMoreTransactions}
                                    disabled={loading.transactions}
                                    className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading.transactions ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            <span>Load More</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )} */}
                    </>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {searchQuery || filterType !== 'all' ? 'No matching transactions' : 'No transactions yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery || filterType !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start by adding your first transaction'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;