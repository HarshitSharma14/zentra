// stores/useFinanceStore.js
import { create } from 'zustand';
import { createUserSlice } from './slices/userSlice';
import { createUiSlice } from './slices/uiSlice';
import { createMonthlyAnalysisSlice } from './slices/monthlyAnalysisSlice';
import { createTransactionSlice } from './slices/transactionSlice';
import { createBudgetSlice } from './slices/budgetSlice';

const useFinanceStore = create((set, get) => ({

    loading: {
        user: false,
        transactions: false,
        monthlyAnalysis: false,
        addingTransaction: false,
        updatingTransaction: false,
        deletingTransaction: false,
        budgets: false,
        updatingBudget: false,
        deletingBudget: false,
        // Add other loading states as needed
    },
    ...createUserSlice(set, get),
    ...createUiSlice(set, get),
    ...createMonthlyAnalysisSlice(set, get),
    ...createTransactionSlice(set, get),
    ...createBudgetSlice(set, get),

}));

export default useFinanceStore;