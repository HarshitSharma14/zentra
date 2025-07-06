// stores/slices/userSlice.js
import axios from 'axios';

export const createUserSlice = (set, get) => ({
    // User state
    user: null,
    showOnboarding: false,
    categories: ['Food & Dining',
        'Transportation',
        'Shopping',
        'Bills & Utilities',
        'Entertainment',
        'Healthcare',
        'Education',
        'Travel',
        'Other',
        'Income',
        'Freelance',
        'Investment',
        'Gift',
        'Other Income'], // Add this field for storing user's custom categories
    summaryData: {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlySpent: 0,
        yearlyIncome: 0,
        yearlySpent: 0
    },

    // User actions
    setShowOnboarding: (show) => set({ showOnboarding: show }),

    setCategories: async (category) => {
        set({ categories: [...get().categories, category] });
        try {
            const response = await axios.post(`/api/user/${get().user}/category`, {
                category
            });
        } catch (error) {
            console.error('Error setting categories:', error);
        }
    },

    // Data freshness utilities
    isDataFresh: (lastFetch, maxAgeMs = 60000) => { // 1 minute default
        return lastFetch && (Date.now() - lastFetch) < maxAgeMs;
    },

    // Refresh summary data if stale
    refreshSummaryIfNeeded: async (forceRefresh = false) => {
        const state = get();

        if (!state.user) return;

        if (forceRefresh || !get().isDataFresh(state.lastUserDataFetch)) {
            try {
                const response = await axios.get(`/api/user/${state.user}`);
                if (response.data.success) {
                    set({
                        summaryData: response.data.summaryData,
                        lastUserDataFetch: Date.now()
                    });
                }
            } catch (error) {
                console.error('Error refreshing summary data:', error);
            }
        }
    },

    // Initialize user - minimal essential data only
    initializeUser: async (currentPath = '/') => {
        // Prevent redundant calls if already loading
        if (get().loading.user) {
            return;
        }

        set((state) => ({
            loading: { ...state.loading, user: true }
        }));

        const userId = localStorage.getItem('ZentraFinanceUserId');

        if (userId) {
            try {
                // Fetch essential user data + fresh summary
                const response = await axios.get(`/api/user/${userId}`);

                if (response.data.success) {
                    console.log('User data loaded:', response.data);
                    set({
                        user: userId,
                        showOnboarding: false,
                        categories: [...get().categories, ...response.data.categories],
                        summaryData: response.data.summaryData, // Use server-calculated summary
                        lastUserDataFetch: Date.now(), // Track freshness
                        // Update budgets in the budget slice format
                        budgets: {
                            monthly: response.data.budgetData.monthlyBudget || {
                                enabled: false,
                                totalBudget: 0,
                                autoRenew: false,
                                categories: {}
                            },
                            yearly: response.data.budgetData.yearlyBudget || {
                                enabled: false,
                                totalBudget: 0,
                                autoRenew: false,
                                categories: {}
                            }
                        },
                        loading: { ...get().loading, user: false }
                    });
                } else {
                    localStorage.removeItem('ZentraFinanceUserId');
                    // If we're not on home page, redirect to home for onboarding
                    if (currentPath !== '/') {
                        set({
                            loading: { user: true, transactions: false, budgets: false, monthlyAnalysis: false }
                        });
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 100);
                        return;
                    }
                    set({
                        showOnboarding: true,
                        loading: { user: false, transactions: false, budgets: false, monthlyAnalysis: false }
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('ZentraFinanceUserId');
                // If we're not on home page, redirect to home for onboarding
                if (currentPath !== '/') {
                    set({
                        loading: { user: true, transactions: false, budgets: false, monthlyAnalysis: false }
                    });
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 100);
                    return;
                }
                set({
                    showOnboarding: true,
                    loading: { user: false, transactions: false, budgets: false, monthlyAnalysis: false }
                });
            }
        } else {
            // If we're not on home page, redirect to home for onboarding
            if (currentPath !== '/') {
                set({
                    loading: { user: true, transactions: false, budgets: false, monthlyAnalysis: false }
                });
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
                return;
            }
            set({
                showOnboarding: true,
                loading: { user: false, transactions: false, budgets: false, monthlyAnalysis: false }
            });
        }
    },

    // Create new user
    createUser: async (withMockData) => {
        set((state) => ({
            loading: { ...state.loading, user: true }
        }));

        try {
            const response = await axios.post('/api/user/create', {
                withMockData
            });

            if (response.data.success) {
                localStorage.setItem('ZentraFinanceUserId', response.data.userId);

                set({
                    user: response.data.userId,
                    showOnboarding: false,
                    categories: [...get().categories, ...response.data.categories],
                    summaryData: { ...get().summaryData, ...response.data.summaryData },
                    // Initialize empty budgets for new user
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
                    loading: { ...get().loading, user: false }
                });

                console.log(get().showOnboarding, get().user, get().loading)
                return { success: true };
            } else {
                set((state) => ({
                    loading: { ...state.loading, user: false }
                }));
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error creating user:', error);
            set((state) => ({
                loading: { ...state.loading, user: false }
            }));
            return { success: false, message: 'Failed to create user' };
        }
    },

    // Update user data
    updateUser: (userData) => set({ user: userData }),

    // Update summary data in frontend
    updateSummaryData: (transactionAmount, transactionDate, isDelete = false) => {
        const currentDate = new Date();
        const txDate = new Date(transactionDate);

        // For balance: when deleting, reverse the transaction effect
        const balanceChange = isDelete ? -transactionAmount : transactionAmount;

        // Always update total balance
        set((state) => ({
            summaryData: {
                ...state.summaryData,
                totalBalance: state.summaryData.totalBalance + balanceChange
            }
        }));

        // Update monthly data if transaction is in current month
        if (txDate.getMonth() === currentDate.getMonth() &&
            txDate.getFullYear() === currentDate.getFullYear()) {

            set((state) => {
                const newSummaryData = { ...state.summaryData };

                // Determine if original transaction was income or expense
                const isIncome = transactionAmount > 0;
                const absAmount = Math.abs(transactionAmount);

                if (isDelete) {
                    // When deleting, remove from the appropriate category
                    if (isIncome) {
                        newSummaryData.monthlyIncome = Math.max(0, (newSummaryData.monthlyIncome || 0) - absAmount);
                    } else {
                        newSummaryData.monthlySpent = Math.max(0, (newSummaryData.monthlySpent || 0) - absAmount);
                    }
                } else {
                    // When adding, add to the appropriate category
                    if (isIncome) {
                        newSummaryData.monthlyIncome = (newSummaryData.monthlyIncome || 0) + absAmount;
                    } else {
                        newSummaryData.monthlySpent = (newSummaryData.monthlySpent || 0) + absAmount;
                    }
                }

                return { summaryData: newSummaryData };
            });
        }

        // Update yearly data if transaction is in current year
        if (txDate.getFullYear() === currentDate.getFullYear()) {
            set((state) => {
                const newSummaryData = { ...state.summaryData };

                // Determine if original transaction was income or expense
                const isIncome = transactionAmount > 0;
                const absAmount = Math.abs(transactionAmount);

                if (isDelete) {
                    // When deleting, remove from the appropriate category
                    if (isIncome) {
                        newSummaryData.yearlyIncome = Math.max(0, (newSummaryData.yearlyIncome || 0) - absAmount);
                    } else {
                        newSummaryData.yearlySpent = Math.max(0, (newSummaryData.yearlySpent || 0) - absAmount);
                    }
                } else {
                    // When adding, add to the appropriate category
                    if (isIncome) {
                        newSummaryData.yearlyIncome = (newSummaryData.yearlyIncome || 0) + absAmount;
                    } else {
                        newSummaryData.yearlySpent = (newSummaryData.yearlySpent || 0) + absAmount;
                    }
                }

                return { summaryData: newSummaryData };
            });
        }
    },

    // Update summary data when editing a transaction
    updateSummaryDataForEdit: (oldAmount, newAmount, oldDate, newDate) => {
        // Remove the old transaction effect
        get().updateSummaryData(oldAmount, oldDate, true);
        // Add the new transaction effect
        get().updateSummaryData(newAmount, newDate, false);
    },

    // Clear summary data
    clearSummaryData: () => set({
        summaryData: {
            totalBalance: 0,
            monthlyIncome: 0,
            monthlySpent: 0,
            yearlyIncome: 0,
            yearlySpent: 0
        }
    }),

    // Logout user
    logoutUser: () => {
        localStorage.removeItem('ZentraFinanceUserId');
        set({
            user: null,
            showOnboarding: true
        });

        // Clear all related data
        get().clearSummaryData();

        // Safely call methods from other slices if they exist
        if (get().clearTransactions) {
            get().clearTransactions();
        }
        if (get().clearBudgets) {
            get().clearBudgets();
        }
        if (get().resetLoading) {
            get().resetLoading();
        }
    }
});