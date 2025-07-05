// stores/slices/uiSlice.js

export const createUiSlice = (set, get) => ({
    // Loading states for each component
    loading: {
        user: false,
        summary: false,
        monthlyAnalysis: false,
        currentBudget: false,
        transactions: false
    },

    // Modal and dialog states
    modals: {
        addTransaction: false,
        editTransaction: false,
        budgetSettings: false,
        userSettings: false
    },

    // Notification states
    notifications: [],

    // UI actions
    setLoading: (type, value) => set((state) => ({
        loading: { ...state.loading, [type]: value }
    })),

    setModal: (modalName, isOpen, data = null) => set((state) => ({
        modals: {
            ...state.modals,
            [modalName]: isOpen
        },
        modalData: isOpen ? data : null
    })),

    // Reset all loading states
    resetLoading: () => set({
        loading: {
            user: false,
            summary: false,
            monthlyAnalysis: false,
            currentBudget: false,
            transactions: false
        }
    }),

    // Add notification
    addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
            id,
            timestamp: new Date(),
            ...notification
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications]
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
            get().removeNotification(id);
        }, 5000);

        return id;
    },

    // Remove notification
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),

    // Success notification helper
    showSuccess: (message, title = 'Success') => {
        return get().addNotification({
            type: 'success',
            title,
            message
        });
    },

    // Error notification helper
    showError: (message, title = 'Error') => {
        return get().addNotification({
            type: 'error',
            title,
            message
        });
    }
});