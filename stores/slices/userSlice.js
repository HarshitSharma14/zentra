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
        set({ categories: [...get().categories, category] })
        try {
            const response = await axios.post(`/api/user/${get().user}/category`, {
                category
            })
        } catch (error) {
            console.error('Error setting categories:', error);
        }
    },

    // Initialize user - minimal essential data only
    initializeUser: async () => {
        set((state) => ({
            loading: { ...state.loading, user: true, transactions: true }
        }));

        const userId = localStorage.getItem('ZentraFinanceUserId');

        if (userId) {
            try {
                // Fetch only essential user data + summary
                const response = await axios.get(`/api/user/${userId}`);


                if (response.data.success) {
                    console.log(response.data)
                    set({
                        user: userId,
                        showOnboarding: false,
                        categories: [...get().categories, ...response.data.categories],
                        summaryData: { ...get().summaryData, ...response.data.summaryData },
                        loading: { ...get().loading, user: false }
                    });

                    // Update summary data
                } else {
                    localStorage.removeItem('ZentraFinanceUserId');
                    set({
                        showOnboarding: true,
                        loading: { ...get().loading, user: false, transactions: false }
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('ZentraFinanceUserId');
                set({
                    showOnboarding: true,
                    loading: { ...get().loading, user: false, transactions: false }
                });
            }
        } else {
            set({
                showOnboarding: true,
                loading: { ...get().loading, user: false, transactions: false }
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
                    summaryData: response.data.summaryData,
                    showOnboarding: false,
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

    // Logout user
    logoutUser: () => {
        localStorage.removeItem('ZentraFinanceUserId');
        set({
            user: null,
            showOnboarding: true
        });

        // Clear all related data
        get().clearSummaryData();
        get().clearTransactions();
        get().clearBudgetData();
        get().resetLoading();
    }
});