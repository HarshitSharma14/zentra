// stores/slices/uiSlice.js
export const createUiSlice = (set, get) => ({
    // UI State
    showOnboarding: false,
    sidebarOpen: false,
    theme: 'light',
    navigationItems: [
        { name: 'Dashboard', href: '/', active: true },
        { name: 'Transactions', href: '/transactions', active: false },
        { name: 'Analytics', href: '/analytics', active: false },
        { name: 'Budgets', href: '/budgets', active: false },
    ],

    setNavigationItems: (items) => set({ navigationItems: items }),

    // Loading states
    loading: {
        user: false,
        transactions: false,
        monthlyAnalysis: false,
        budgets: false,
        categories: false,
    },

    // UI Actions
    setShowOnboarding: (show) => set({ showOnboarding: show }),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    setTheme: (theme) => set({ theme }),

    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
    })),

    // Loading state helpers
    setLoading: (key, value) => set((state) => ({
        loading: {
            ...state.loading,
            [key]: value
        }
    })),

    setMultipleLoading: (loadingStates) => set((state) => ({
        loading: {
            ...state.loading,
            ...loadingStates
        }
    })),

    // Reset all loading states
    resetLoading: () => set((state) => ({
        loading: Object.keys(state.loading).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {})
    }))
});