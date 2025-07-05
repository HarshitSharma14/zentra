// components/home/HomePage.js
'use client';
import { useState, useEffect } from 'react';
import useFinanceStore from '@/stores/useFinanceStore';
import Header from './Header';
import SummaryCard from './SummaryCard';
import AddTransactionDialog from './AddTransactionDialog';
import MonthlyAnalysis from './MonthlyAnalysis';
import CurrentBudget from './CurrentBudget';

const HomePage = () => {
    const {
        user,
        loading,
        showOnboarding,
        initializeUser,
        createUser,
    } = useFinanceStore();

    const [showAddTransaction, setShowAddTransaction] = useState(false);

    // Initialize user on page load
    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    // Loading state - show until we have user data OR need to show onboarding
    if (loading.user || (!user && !showOnboarding)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto mb-6"></div>
                        <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Loading Zentra Finance
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Preparing your financial dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Onboarding modal
    if (showOnboarding) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Header />

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
                                Let's set up your personal finance tracker. Would you like to start with sample data to explore the features?
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

                {!showAddTransaction && (
                    <SummaryCard
                        onAddTransaction={() => setShowAddTransaction(true)}
                    />
                )}

                {showAddTransaction && (
                    <AddTransactionDialog
                        onClose={() => setShowAddTransaction(false)}
                        onSuccess={() => {
                            setShowAddTransaction(false);
                            alert('Transaction added! Redirecting to transaction history...');
                        }}
                    />
                )}

                {/* Main Content Grid - Better spacing and height */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 min-h-[600px]">
                    <div className="xl:col-span-2">
                        <MonthlyAnalysis />
                    </div>
                    <div className="xl:col-span-3">
                        {/* <CurrentBudget /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;