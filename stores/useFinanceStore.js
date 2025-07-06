// stores/useFinanceStore.js
import { create } from 'zustand';
import { createUserSlice } from './slices/userSlice';
import { createUiSlice } from './slices/uiSlice';
import { createMonthlyAnalysisSlice } from './slices/monthlyAnalysisSlice';
import { createTransactionSlice } from './slices/transactionSlice';

const useFinanceStore = create((set, get) => ({

    loading: {
        user: false,
        transactions: false,
        monthlyAnalysis: false,
        // Add other loading states as needed
    },
    ...createUserSlice(set, get),
    ...createUiSlice(set, get),
    ...createMonthlyAnalysisSlice(set, get),
    ...createTransactionSlice(set, get),

}));

export default useFinanceStore;