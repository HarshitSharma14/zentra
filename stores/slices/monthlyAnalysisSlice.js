import axios from "axios";

// stores/slices/monthlyAnalysisSlice.js
export const createMonthlyAnalysisSlice = (set, get) => ({
    // Monthly Analysis State
    monthlyAnalysis: {
        pieChart: [],        // Category breakdown data
        barChart: [],
    },

    // Actions
    fetchMonthlyAnalysisData: async () => {
        const { user } = get();

        if (!user) {
            console.error('No user ID available for fetching monthly analysis');
            return;
        }

        // Set loading state
        set((state) => ({
            loading: {
                ...state.loading,
                monthlyAnalysis: true
            }
        }));

        try {
            const response = await axios.get(`/api/analytics/monthly/${user}`);
            const result = response.data;

            if (result.success) {
                set((state) => ({
                    monthlyAnalysis: {
                        pieChart: result.data.pieChart || [],
                        barChart: result.data.barChart || [],
                    },
                    loading: {
                        ...state.loading,
                        monthlyAnalysis: false
                    }
                }));
            } else {
                console.error('Failed to fetch monthly analysis:', result.message);
                set((state) => ({
                    loading: {
                        ...state.loading,
                        monthlyAnalysis: false
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching monthly analysis:', error);
            set((state) => ({
                loading: {
                    ...state.loading,
                    monthlyAnalysis: false
                }
            }));
        }
    },

    // Getters for Pie Chart (Category-wise expenses)
    getPieChartData: () => {
        const { monthlyAnalysis } = get();
        return (monthlyAnalysis.pieChart || []).map((item, index) => ({
            name: item.category,
            value: item.amount,
            percentage: item.percentage,
            fill: `hsl(${index * 45}, 70%, 50%)`
        }));
    },

    // Getters for Bar Chart (Daily spending)
    getBarChartData: () => {
        const { monthlyAnalysis } = get();
        return (monthlyAnalysis.barChart || []).map(item => ({
            name: `Day ${item.day}`,
            day: item.day,
            value: item.amount,
            fill: 'hsl(210, 70%, 50%)'
        }));
    },

    // Get summary data
    getMonthlyAnalysisSummary: () => {
        const { monthlyAnalysis } = get();
        const pieData = monthlyAnalysis.pieChart || [];

        return {
            totalSpent: monthlyAnalysis.totalSpent || 0,
            topCategory: pieData.length > 0 ? pieData[0].category : 'No expenses',
            transactionCount: pieData.reduce((sum, item) => sum + (item.count || 0), 0),
            categoryCount: pieData.length,
            // You can add more calculated fields here if needed
        };
    },


    // Getters for Pie Chart (Category-wise expenses)
    getFormattedPieChartData: () => {
        const { monthlyAnalysis } = get();
        return (monthlyAnalysis.pieChart || []).map((item, index) => ({
            name: item.category,
            value: item.amount,
            percentage: item.percentage,
            fill: `hsl(${index * 45}, 70%, 50%)` // Generate colors
        }));
    },

    // Getters for Bar Chart (Daily spending)
    getFormattedBarChartData: () => {
        const { monthlyAnalysis } = get();
        return (monthlyAnalysis.barChart || []).map(item => ({
            day: item.day,
            amount: item.amount
        }));
    },
    // Backward compatibility getters (if other components still use these names)
    getCategoryBreakdown: () => {
        const { monthlyAnalysis } = get();
        return monthlyAnalysis.pieChart || [];
    },

    getDailySpending: () => {
        const { monthlyAnalysis } = get();
        return monthlyAnalysis.barChart || [];
    },

    // Clear monthly analysis data
    clearMonthlyAnalysis: () => {
        set((state) => ({
            monthlyAnalysis: {
                pieChart: [],
                barChart: [],
                totalSpent: 0,
                lastFetched: null
            }
        }));
    }
});