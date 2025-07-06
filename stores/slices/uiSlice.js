// stores/slices/uiSlice.js
export const createUiSlice = (set, get) => ({
    // UI State
    showOnboarding: false,
    sidebarOpen: false,
    theme: 'light',
    themeInitialized: false,
    navigationItems: [
        { name: 'Dashboard', href: '/', active: true },
        { name: 'Transactions', href: '/transactions', active: false },
        { name: 'Budgets', href: '/budget', active: false },
    ],

    setNavigationItems: (items) => set({ navigationItems: items }),

    // Loading states
    loading: {
        user: false,
        transactions: false,
        monthlyAnalysis: false,
        budgets: false,
        categories: false,
        addingTransaction: false,
        updatingTransaction: false,
        deletingTransaction: false,
    },

    // UI Actions
    setShowOnboarding: (show) => set({ showOnboarding: show }),

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Enhanced theme management
    initializeTheme: () => {
        if (typeof window === 'undefined') return; // Skip on server

        try {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

            set({
                theme: isDark ? 'dark' : 'light',
                themeInitialized: true
            });

            // Apply theme to document
            if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
            }
        } catch (error) {
            console.warn('Failed to initialize theme:', error);
            set({
                theme: 'light',
                themeInitialized: true
            });
        }
    },

    setTheme: (theme) => {
        if (typeof window === 'undefined') return;

        set({ theme });
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    },

    toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
    },

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