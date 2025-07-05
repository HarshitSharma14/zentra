// stores/slices/userSlice.js
import axios from 'axios';

export const createUserSlice = (set, get) => ({
    // User state
    user: null,
    showOnboarding: false,
    summaryData: {},


    // User actions
    setShowOnboarding: (show) => set({ showOnboarding: show }),

    // Initialize user - minimal essential data only
    initializeUser: async () => {
        set((state) => ({
            loading: { ...state.loading, user: true }
        }));

        const userId = localStorage.getItem('ZentraFinanceUserId');

        if (userId) {
            try {
                // Fetch only essential user data + summary
                const response = await axios.get(`/api/user/${userId}`);

                if (response.data.success) {
                    set({
                        user: userId,
                        showOnboarding: false,
                        summaryData: response.data.summaryData,
                        loading: { ...get().loading, user: false }
                    });

                    // Update summary data
                } else {
                    localStorage.removeItem('ZentraFinanceUserId');
                    set({
                        showOnboarding: true,
                        loading: { ...get().loading, user: false }
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('ZentraFinanceUserId');
                set({
                    showOnboarding: true,
                    loading: { ...get().loading, user: false }
                });
            }
        } else {
            set({
                showOnboarding: true,
                loading: { ...get().loading, user: false }
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