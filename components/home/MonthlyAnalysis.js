// components/home/MonthlyAnalysis.js
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader, PieChart as PieIcon, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const MonthlyAnalysis = () => {
  const {
    loading,
    fetchMonthlyAnalysisData,
    getFormattedPieChartData,
    getFormattedBarChartData
  } = useFinanceStore();

  // State for selected month/year
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(), // 0-based (0 = January)
      year: now.getFullYear()
    };
  });

  useEffect(() => {
    fetchMonthlyAnalysisData(selectedDate.month, selectedDate.year);
  }, [fetchMonthlyAnalysisData, selectedDate]);

  const pieData = getFormattedPieChartData();
  const barData = getFormattedBarChartData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setSelectedDate(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      } else {
        return { month: prev.month - 1, year: prev.year };
      }
    });
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      } else {
        return { month: prev.month + 1, year: prev.year };
      }
    });
  };

  // Check if we can go to next month (don't go beyond current month)
  const canGoNext = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (selectedDate.year < currentYear) return true;
    if (selectedDate.year === currentYear && selectedDate.month < currentMonth) return true;
    return false;
  };

  // Format the selected month for display
  const formatSelectedMonth = () => {
    const date = new Date(selectedDate.year, selectedDate.month, 1);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading.monthlyAnalysis) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 h-full flex w-full items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading monthly analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6 lg:p-8 h-full w-full flex flex-col">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          title="Previous Month"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Monthly Analysis
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            {formatSelectedMonth()}
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${canGoNext()
            ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            : 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
            }`}
          title="Next Month"
        >
          <ChevronRight className={`h-5 w-5 ${canGoNext()
            ? 'text-gray-600 dark:text-gray-400'
            : 'text-gray-400 dark:text-gray-600'
            }`} />
        </button>
      </div>

      {/* Charts container: always stacked vertically */}
      <div className="flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3 md:p-4 lg:p-6 flex-1 min-h-0">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <PieIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
              Expenses by Category
            </h4>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No expenses in {formatSelectedMonth()}</p>
            </div>
          )}
        </div>

        {/* Bar Chart - Daily Spending */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3 md:p-4 lg:p-6 flex-1 min-h-0">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
            <h4 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
              Daily Spending - {formatSelectedMonth()}
            </h4>
          </div>

          {barData.length > 0 ? (
            <div className="h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Spent']}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Bar dataKey="amount" fill="hsl(210, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No spending data for {formatSelectedMonth()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalysis;