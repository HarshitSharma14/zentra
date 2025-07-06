// components/home/Header.js
'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Settings, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import useFinanceStore from '@/stores/useFinanceStore';

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { navigationItems, setNavigationItems } = useFinanceStore();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };


    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">

                        {/* Logo & Brand */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-lg lg:text-xl">Z</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                                        Zentra Finance
                                    </h1>
                                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 -mt-1 font-medium">
                                        Personal Wealth Manager
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${item.active
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search transactions, categories..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-2 lg:space-x-3">

                            {/* Mobile Search Button */}
                            <button className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Notifications */}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {darkMode ? (
                                    <Sun className="h-5 w-5 text-yellow-500" />
                                ) : (
                                    <Moon className="h-5 w-5 text-gray-600" />
                                )}
                            </button>

                            {/* Settings */}

                            {/* Profile */}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {showMobileMenu ? (
                                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                ) : (
                                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {showMobileMenu && (
                    <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                        <div className="px-4 py-4 space-y-2">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {item.name}
                                </a>
                            ))}

                            {/* Mobile Search */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search transactions..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Backdrop for mobile menu */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}

            {/* Backdrop for notifications */}
            {showNotifications && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </>
    );
};

export default Header;