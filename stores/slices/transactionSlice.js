// stores/slices/transactionSlice.js
import { CleaningServices } from '@mui/icons-material';
import axios from 'axios';

export const createTransactionSlice = (set, get) => ({
    // Transaction State
    transactions: [],
    // Actions
    addTransaction: async (transactionData) => {
        try {
            set((state) => ({
                loading: { ...state.loading, addingTransaction: true }
            }));

            const response = await axios.post(`/api/transactions/${get().user}`, transactionData);

            if (response.data.success) {
                // Force refresh transactions and summary data since we added a transaction
                await get().fetchTransactions(true);

                set((state) => ({
                    loading: { ...state.loading, addingTransaction: false }
                }));
                return { success: true, transaction: response.data.transaction };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('Error adding transaction:', error);
            set((state) => ({
                loading: { ...state.loading, addingTransaction: false }
            }));
            return { success: false, message: 'Failed to add transaction' };
        }
    },

    updateTransaction: async (transactionId, transactionData, originalTransaction) => {
        try {
            set((state) => ({
                loading: { ...state.loading, updatingTransaction: true }
            }));

            const response = await axios.put(`/api/transactions/${get().user}/${transactionId}`, transactionData);

            if (response.data.success) {
                // Force refresh transactions and summary data since we updated a transaction
                await get().fetchTransactions(true);

                set((state) => ({
                    loading: { ...state.loading, updatingTransaction: false }
                }));
                return { success: true, transaction: response.data.transaction };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('Error updating transaction:', error);
            set((state) => ({
                loading: { ...state.loading, updatingTransaction: false }
            }));
            return { success: false, message: 'Failed to update transaction' };
        }
    },

    deleteTransaction: async (transactionId, transactionToDelete) => {
        try {
            set((state) => ({
                loading: { ...state.loading, deletingTransaction: true }
            }));

            const response = await axios.delete(`/api/transactions/${get().user}/${transactionId}`);

            if (response.data.success) {
                // Force refresh transactions and summary data since we deleted a transaction
                await get().fetchTransactions(true);

                set((state) => ({
                    loading: { ...state.loading, deletingTransaction: false }
                }));
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            set((state) => ({
                loading: { ...state.loading, deletingTransaction: false }
            }));
            return { success: false, message: 'Failed to delete transaction' };
        }
    },

    fetchTransactions: async (forceRefresh = false) => {
        // Prevent redundant calls if already loading
        if (get().loading.transactions) {
            return;
        }

        // Check if data is fresh and we don't need to refresh
        const state = get();
        if (!forceRefresh && state.lastTransactionsFetch && get().isDataFresh(state.lastTransactionsFetch)) {
            console.log('Transactions data is fresh, skipping fetch');
            return;
        }

        try {
            set((state) => ({
                loading: { ...state.loading, transactions: true }
            }));

            const response = await axios.get(`/api/transactions/${get().user}`);

            if (response.data.success) {
                const newTransactions = response.data.transactions;

                set((state) => ({
                    transactions: newTransactions,
                    lastTransactionsFetch: Date.now(), // Track freshness
                    loading: { ...state.loading, transactions: false }
                }));

                // Refresh summary data since transactions changed
                get().refreshSummaryIfNeeded(true);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            set((state) => ({
                loading: { ...state.loading, transactions: false }
            }));
        }
    },
    // Clear data
    clearTransactions: () => {
        set({
            transactions: [],
        });
    }
});