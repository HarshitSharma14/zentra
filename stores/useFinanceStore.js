// stores/useFinanceStore.js
import { create } from 'zustand';
import axios from 'axios';

const useFinanceStore = create((set, get) => ({
    // User data
    user: null,
    currentBalance: 0,
    transactionCount: 0,

    // Loading states
    loading: {
        user: false,
        transactions: false,
        general: false
    },

    // UI states
    showOnboarding: false,

    // Transactions data
    transactions: [],

    // Actions
    setLoading: (type, value) => set((state) => ({
        loading: { ...state.loading, [type]: value }
    })),

    setShowOnboarding: (show) => set({ showOnboarding: show }),

    // Initialize user - check localStorage and fetch data
    initializeUser: async () => {
        set((state) => ({ loading: { ...state.loading, user: true } }));

        const userId = localStorage.getItem('ZentraFinanceUserId');

        if (userId) {
            try {
                const response = await axios.get(`/api/user/${userId}`);

                if (response.data.success) {
                    set({
                        user: response.data.user,
                        currentBalance: response.data.currentBalance,
                        transactionCount: response.data.transactionCount,
                        loading: { ...get().loading, user: false },
                        showOnboarding: false
                    });
                } else {
                    // User not found, remove invalid ID
                    localStorage.removeItem('ZentraFinanceUserId');
                    set({
                        loading: { ...get().loading, user: false },
                        showOnboarding: true
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('ZentraFinanceUserId');
                set({
                    loading: { ...get().loading, user: false },
                    showOnboarding: true
                });
            }
        } else {
            // No user ID found
            set({
                loading: { ...get().loading, user: false },
                showOnboarding: true
            });
        }
    },

    // Create new user
    createUser: async (withMockData) => {
        set((state) => ({ loading: { ...state.loading, user: true } }));

        try {
            const response = await axios.post('/api/user/create', {
                withMockData
            });

            if (response.data.success) {
                // Save user ID to localStorage
                localStorage.setItem('ZentraFinanceUserId', response.data.userId);

                set({
                    user: response.data.user,
                    currentBalance: response.data.currentBalance, // Will be updated if mock data added
                    transactionCount: withMockData ? 30 : 0,
                    loading: { ...get().loading, user: false },
                    showOnboarding: false
                });

                return { success: true };
            } else {
                set((state) => ({ loading: { ...state.loading, user: false } }));
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error creating user:', error);
            set((state) => ({ loading: { ...state.loading, user: false } }));
            return { success: false, message: 'Failed to create user' };
        }
    },

    // Update user data
    updateUser: (userData) => set({ user: userData }),

    // Update current balance
    updateBalance: (newBalance) => set({ currentBalance: newBalance }),

    // Add transaction to store
    addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions],
        currentBalance: transaction.runningBalance,
        transactionCount: state.transactionCount + 1
    })),

    // Update transaction in store
    updateTransaction: (transactionId, updatedTransaction) => set((state) => ({
        transactions: state.transactions.map(tx =>
            tx._id === transactionId ? updatedTransaction : tx
        ),
        currentBalance: updatedTransaction.runningBalance
    })),

    // Remove transaction from store
    removeTransaction: (transactionId) => set((state) => ({
        transactions: state.transactions.filter(tx => tx._id !== transactionId),
        transactionCount: state.transactionCount - 1
    })),

    // Set transactions array
    setTransactions: (transactions) => set({ transactions }),

    // Clear all data (logout)
    clearData: () => {
        localStorage.removeItem('ZentraFinanceUserId');
        set({
            user: null,
            currentBalance: 0,
            transactionCount: 0,
            transactions: [],
            showOnboarding: true,
            loading: {
                user: false,
                transactions: false,
                general: false
            }
        });
    },

    // Get summary data for dashboard
    getSummaryData: () => {
        const state = get();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calculate monthly spending (expenses only)
        const monthlyTransactions = state.transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear &&
                tx.amount < 0; // Only expenses
        });

        const monthlySpent = monthlyTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        // Calculate monthly income
        const monthlyIncome = state.transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear &&
                    tx.amount > 0; // Only income
            })
            .reduce((sum, tx) => sum + tx.amount, 0);

        return {
            totalBalance: state.currentBalance,
            monthlySpent,
            monthlyIncome,
            daysInMonth: new Date(currentYear, currentMonth + 1, 0).getDate(),
            currentDay: currentDate.getDate()
        };
    }
}));

export default useFinanceStore;