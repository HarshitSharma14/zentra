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
        getSummaryData
    } = useFinanceStore();

    const [showAddTransaction, setShowAddTransaction] = useState(false);

    // Initialize user on page load
    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    // Loading state
    if (loading.user || (!user && !showOnboarding)) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Onboarding modal
    if (showOnboarding) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Header />

                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Welcome to Zentra Finance! 🎉
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Let's set up your personal finance tracker. Would you like to start with sample data to explore the features?
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => createUser(true)}
                                disabled={loading.user}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                            >
                                {loading.user ? 'Creating...' : 'Yes, add sample data'}
                            </button>

                            <button
                                onClick={() => createUser(false)}
                                disabled={loading.user}
                                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:cursor-not-allowed"
                            >
                                {loading.user ? 'Creating...' : 'No, start fresh'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sample data includes 30 transactions with realistic spending patterns
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {!showAddTransaction && (
                    <SummaryCard
                        summaryData={getSummaryData()}
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

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    <div className="xl:col-span-2">
                        <MonthlyAnalysis />
                    </div>
                    <div className="xl:col-span-3">
                        <CurrentBudget />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;