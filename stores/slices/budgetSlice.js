// stores/slices/budgetSlice.js
import axios from 'axios';

export const createBudgetSlice = (set, get) => ({
    // Budget state
    budgets: {
        monthly: {
            enabled: false,
            totalBudget: 0,
            autoRenew: false,
            categories: {}
        },
        yearly: {
            enabled: false,
            totalBudget: 0,
            autoRenew: false,
            categories: {}
        }
    },

    // Actions
    fetchBudgets: async (forceRefresh = false) => {
        // Prevent redundant calls if already loading
        if (get().loading.budgets) {
            return;
        }

        // Check if data is fresh and we don't need to refresh
        const state = get();
        if (!forceRefresh && state.lastBudgetsFetch && get().isDataFresh(state.lastBudgetsFetch)) {
            console.log('Budget data is fresh, skipping fetch');
            return;
        }

        try {
            set((state) => ({
                loading: { ...state.loading, budgets: true }
            }));

            const response = await axios.get(`/api/budget/${get().user}`);

            if (response.data.success) {
                set((state) => ({
                    budgets: response.data.budgets,
                    lastBudgetsFetch: Date.now(), // Track freshness
                    loading: { ...state.loading, budgets: false }
                }));
            } else {
                console.error('Failed to fetch budgets:', response.data.message);
                set((state) => ({
                    loading: { ...state.loading, budgets: false }
                }));
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
            set((state) => ({
                loading: { ...state.loading, budgets: false }
            }));
        }
    },

    createOrUpdateBudget: async (budgetType, budgetData) => {
        try {
            set((state) => ({
                loading: { ...state.loading, updatingBudget: true }
            }));

            const response = await axios.post(`/api/budget/${get().user}`, {
                budgetType,
                ...budgetData
            });

            if (response.data.success) {
                // Update local state
                set((state) => ({
                    budgets: {
                        ...state.budgets,
                        [budgetType]: response.data.budget
                    },
                    loading: { ...state.loading, updatingBudget: false }
                }));

                return { success: true, budget: response.data.budget };
            } else {
                set((state) => ({
                    loading: { ...state.loading, updatingBudget: false }
                }));
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error creating/updating budget:', error);
            set((state) => ({
                loading: { ...state.loading, updatingBudget: false }
            }));
            return { success: false, message: 'Failed to save budget' };
        }
    },

    deleteBudget: async (budgetType) => {
        try {
            set((state) => ({
                loading: { ...state.loading, deletingBudget: true }
            }));

            const response = await axios.delete(`/api/budget/${get().user}/${budgetType}`);

            if (response.data.success) {
                // Reset the budget in local state
                set((state) => ({
                    budgets: {
                        ...state.budgets,
                        [budgetType]: {
                            enabled: false,
                            totalBudget: 0,
                            autoRenew: false,
                            categories: {}
                        }
                    },
                    loading: { ...state.loading, deletingBudget: false }
                }));

                return { success: true };
            } else {
                set((state) => ({
                    loading: { ...state.loading, deletingBudget: false }
                }));
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            set((state) => ({
                loading: { ...state.loading, deletingBudget: false }
            }));
            return { success: false, message: 'Failed to delete budget' };
        }
    },

    // Calculate spent amounts by category
    getSpentAmounts: (budgetType) => {
        const { transactions } = get();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const categorySpending = {};
        let totalSpent = 0;

        // Filter transactions based on budget type
        const filteredTransactions = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            if (budgetType === 'monthly') {
                return txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear &&
                    tx.amount < 0;
            } else { // yearly
                return txDate.getFullYear() === currentYear && tx.amount < 0;
            }
        });

        filteredTransactions.forEach(tx => {
            const category = tx.category;
            const amount = Math.abs(tx.amount);

            if (!categorySpending[category]) {
                categorySpending[category] = 0;
            }
            categorySpending[category] += amount;
            totalSpent += amount;
        });

        return { categorySpending, totalSpent };
    },

    // Get budget summary with progress
    getBudgetSummary: (budgetType) => {
        const { budgets } = get();
        const budget = budgets[budgetType];
        const { categorySpending, totalSpent } = get().getSpentAmounts(budgetType);

        if (!budget.enabled) {
            return null;
        }

        const categoryProgress = {};
        Object.entries(budget.categories).forEach(([category, budgetAmount]) => {
            const spent = categorySpending[category] || 0;
            categoryProgress[category] = {
                budgeted: budgetAmount,
                spent,
                remaining: Math.max(0, budgetAmount - spent),
                percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0,
                isOverBudget: spent > budgetAmount
            };
        });

        const totalBudgeted = budget.totalBudget;
        const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
        const totalPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

        return {
            totalBudgeted,
            totalSpent,
            totalRemaining,
            totalPercentage,
            isOverBudget: totalSpent > totalBudgeted,
            categoryProgress,
            autoRenew: budget.autoRenew
        };
    },

    // Clear budgets
    clearBudgets: () => {
        set({
            budgets: {
                monthly: {
                    enabled: false,
                    totalBudget: 0,
                    autoRenew: false,
                    categories: {}
                },
                yearly: {
                    enabled: false,
                    totalBudget: 0,
                    autoRenew: false,
                    categories: {}
                }
            }
        });
    }
});