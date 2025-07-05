// stores/useFinanceStore.js
import { create } from 'zustand';
import { createUserSlice } from './slices/userSlice';
import { createUiSlice } from './slices/uiSlice';

const useFinanceStore = create((set, get) => ({
    ...createUserSlice(set, get),
    ...createUiSlice(set, get)
}));

export default useFinanceStore;