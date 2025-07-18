// components/home/HomePage.js
'use client';
import { useState, useEffect } from 'react';
import useFinanceStore from '@/stores/useFinanceStore';
import Header from './Header';
import SummaryCard from './SummaryCard';
import AddTransactionDialog from './AddTransactionDialog';
import MonthlyAnalysis from './MonthlyAnalysis';
import CurrentBudget from './CurrentBudget';
import LoadingScreen from '@/components/ui/LoadingScreen';

const HomePage = () => {
    const {
        user,
        loading,
        showOnboarding,
        summaryData,
        initializeUser,
        createUser,
        setNavigationItems
    } = useFinanceStore();

    const [showAddTransaction, setShowAddTransaction] = useState(false);

    // Debug log to check summary data
    console.log('HomePage - Summary Data:', summaryData);

    // Initialize user on page load
    useEffect(() => {
        initializeUser('/'); // Pass current path for proper redirect handling
        setNavigationItems([
            { name: 'Dashboard', href: '/', active: true },
            { name: 'Transactions', href: '/transactions', active: false },
            { name: 'Budgets', href: '/budget', active: false },
        ]);
    }, [initializeUser]);

    // Loading state - show until we have user data OR need to show onboarding
    if (loading.user || (!user && !showOnboarding)) {
        return (
            <LoadingScreen
                title="Loading Zentra Finance"
                description="Preparing your financial dashboard..."
            />
        );
    }

    // Onboarding modal
    if (showOnboarding) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">

                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 max-w-lg w-full">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white font-bold text-2xl">Z</span>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                                Welcome to Zentra Finance! 🎉
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Let&apos;s set up your personal finance tracker. Would you like to start with sample data to explore the features?
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => createUser(true)}
                                disabled={loading.user}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                            >
                                {loading.user ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                        Creating your account...
                                    </div>
                                ) : (
                                    'Yes, add sample data'
                                )}
                            </button>

                            <button
                                onClick={() => createUser(false)}
                                disabled={loading.user}
                                className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                            >
                                {loading.user ? 'Creating...' : 'No, start fresh'}
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sample data includes 30 transactions with realistic spending patterns across multiple categories
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">

            <div className="w-[90%] mx-auto px-6 lg:px-8 py-8">

                {!showAddTransaction && (
                    <SummaryCard
                        onAddTransaction={() => setShowAddTransaction(true)}
                    />
                )}

                {showAddTransaction && (
                    <AddTransactionDialog
                        open={showAddTransaction}
                        onClose={() => setShowAddTransaction(false)}
                        onSuccess={() => {
                            setShowAddTransaction(false);
                            router.push('/transactions');
                            // alert('Transaction added! Redirecting to transaction history...');
                        }}
                    />
                )}

                {/* Main Content Grid - Responsive layout */}
                <div className="flex w-[100%] flex-col xl:flex-row gap-4 md:gap-6 lg:gap-8 min-h-[500px] sm:min-h-[600px]">
                    <div className="flex w-full xl:w-[50%]">
                        <MonthlyAnalysis />
                    </div>
                    <div className="flex w-full xl:w-[50%]">
                        <CurrentBudget />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;