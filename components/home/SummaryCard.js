// components/home/SummaryCard.js
import { Plus } from 'lucide-react';

const SummaryCard = ({ summaryData, onAddTransaction }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">

                    {/* Total Balance */}
                    <div className="text-center lg:text-left">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Total Balance
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(summaryData.totalBalance)}
                        </p>
                    </div>

                    {/* Monthly Details */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <div className="text-center lg:text-left">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                This Month Spent
                            </p>
                            <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                                {formatCurrency(summaryData.monthlySpent)}
                            </p>
                        </div>
                        <div className="text-center lg:text-left">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Monthly Income
                            </p>
                            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                {formatCurrency(summaryData.monthlyIncome)}
                            </p>
                        </div>
                    </div>

                    {/* Add Transaction Button */}
                    <div className="flex justify-center lg:justify-end">
                        <button
                            onClick={onAddTransaction}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                        >
                            <Plus className="h-5 w-5" />
                            Add Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;