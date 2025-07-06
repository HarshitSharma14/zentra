'use client';
import { useEffect } from 'react';
import useFinanceStore from '@/stores/useFinanceStore';

const ThemeProvider = ({ children }) => {
    const { themeInitialized, initializeTheme } = useFinanceStore();

    // Initialize theme immediately when provider mounts
    useEffect(() => {
        if (!themeInitialized) {
            initializeTheme();
        }
    }, [themeInitialized, initializeTheme]);

    // Show a minimal loading state until theme is initialized
    if (!themeInitialized) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return children;
};

export default ThemeProvider; 