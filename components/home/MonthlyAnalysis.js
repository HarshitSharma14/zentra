// components/home/MonthlyAnalysis.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader, PieChart as PieIcon, BarChart3, ChevronLeft, ChevronRight, Target, ArrowRight } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const MonthlyAnalysis = () => {
  const router = useRouter();
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
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
      <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-8 h-full flex w-full items-center justify-center transition-colors duration-300 shadow-card">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4 transition-colors duration-300" />
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Loading monthly analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-4 md:p-6 lg:p-8 h-full w-full flex flex-col shadow-card hover:shadow-card-hover hover:scale-[1.01] hover:border-primary/20 transition-all duration-300">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-200"
          title="Previous Month"
        >
          <ChevronLeft className="h-5 w-5 text-secondary-foreground" />
        </button>

        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            Monthly Analysis
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {formatSelectedMonth()}
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${canGoNext()
            ? 'bg-secondary hover:bg-secondary/80 shadow-button hover:shadow-button-hover hover:scale-105'
            : 'bg-muted cursor-not-allowed opacity-50'
            }`}
          title="Next Month"
        >
          <ChevronRight className={`h-5 w-5 ${canGoNext()
            ? 'text-secondary-foreground'
            : 'text-muted-foreground'
            }`} />
        </button>
      </div>

      {/* Charts container: always stacked vertically */}
      <div className="flex flex-col gap-4 md:gap-6 flex-1 min-h-0">
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-secondary/30 rounded-2xl p-3 md:p-4 lg:p-6 flex-1 min-h-0 shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 border border-border/30">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <PieIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground">
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
        <div className="bg-secondary/30 rounded-2xl p-3 md:p-4 lg:p-6 flex-1 min-h-0 shadow-card hover:shadow-card-hover hover:scale-[1.01] transition-all duration-300 border border-border/30">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-chart-1" />
            <h4 className="text-sm md:text-base lg:text-lg font-semibold text-foreground">
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
                    tickFormatter={(value) => `₹${value}`}
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

      {/* Budget Action Buttons - Added at the bottom */}

    </div>
  );
};

export default MonthlyAnalysis;