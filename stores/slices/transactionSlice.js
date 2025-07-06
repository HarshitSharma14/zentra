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

            console.log(transactionData)
            console.log(response.data)

            if (response.data.success) {
                // Add new transaction to the beginning of the list
                set((state) => {
                    const updatedTransactions = [
                        response.data.transaction,
                        ...state.transactions
                    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // latest first

                    return {
                        transactions: updatedTransactions,
                        loading: { ...state.loading, addingTransaction: false }
                    };
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding transaction:', error);
            set((state) => ({
                loading: { ...state.loading, addingTransaction: false }
            }));
            return false;
        }
    },

    fetchTransactions: async () => {
        try {
            set((state) => ({
                loading: { ...state.loading, transactions: true }
            }));

            const response = await axios.get(`/api/transactions/${get().user}`);

            if (response.data.success) {
                const newTransactions = response.data.transactions;

                set((state) => ({
                    transactions: newTransactions,
                    loading: { ...state.loading, transactions: false }
                }));
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