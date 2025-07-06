'use client';

const LoadingScreen = ({
    title = "Loading",
    description = "Please wait...",
    className = ""
}) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300 ${className}`}>
            <div className="text-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 mx-auto mb-6 transition-colors duration-300"></div>
                    <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 dark:border-blue-400 mx-auto transition-colors duration-300"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                    {title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen; 