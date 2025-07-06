// components/home/MonthlyAnalysis.js
import { useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const MonthlyAnalysis = () => {
  const {
    loading,
    fetchMonthlyAnalysisData,
    getFormattedPieChartData,
    getFormattedBarChartData
  } = useFinanceStore();

  useEffect(() => {
    fetchMonthlyAnalysisData();
  }, [fetchMonthlyAnalysisData]);

  const pieData = getFormattedPieChartData();
  const barData = getFormattedBarChartData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading.monthlyAnalysis) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading monthly analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 h-full">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Monthly Analysis
      </h3>

      <div className="space-y-8">
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PieIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Expenses by Category
            </h4>
          </div>

          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No expenses this month</p>
            </div>
          )}
        </div>

        {/* Bar Chart - Daily Spending */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Daily Spending This Month
            </h4>
          </div>

          {barData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
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
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No spending data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalysis;