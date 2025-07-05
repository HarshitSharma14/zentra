// components/home/MonthlyAnalysis.js
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const MonthlyAnalysis = () => {
    const handleClick = () => {
        // TODO: Navigate to detailed monthly expenses page
        alert('Opening detailed monthly expenses...');
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-all group"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Analysis
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Charts Placeholder */}
            <div className="space-y-6">
                {/* Pie Chart Area */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 h-48 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category Breakdown
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Click to view details
                        </p>
                    </div>
                </div>

                {/* Bar Chart Area */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 h-32 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="text-center">
                        <Calendar className="h-8 w-8 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Monthly Trends
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Last 6 months
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyAnalysis;