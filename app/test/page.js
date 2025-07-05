// app/test/page.js
'use client';
import { useState, useEffect } from 'react';

export default function TestPage() {
    const [mongoStatus, setMongoStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        testMongoConnection();
    }, []);

    const testMongoConnection = async () => {
        try {
            const response = await fetch('/api/test-connection');
            const data = await response.json();
            setMongoStatus(data);
        } catch (error) {
            setMongoStatus({
                success: false,
                message: 'Failed to fetch connection status',
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header - Testing Tailwind */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        🚀 Zentra Finance Setup Test
                    </h1>
                    <p className="text-lg text-gray-600">
                        Testing Tailwind CSS and MongoDB Connection
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tailwind Test Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Tailwind CSS
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-6">
                            If you can see this styled card with colors, shadows, and responsive layout, Tailwind is working perfectly!
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-green-800 font-medium">✅ Colors</span>
                                <span className="text-green-600">Working</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-blue-800 font-medium">✅ Layout</span>
                                <span className="text-blue-600">Working</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <span className="text-purple-800 font-medium">✅ Spacing</span>
                                <span className="text-purple-600">Working</span>
                            </div>
                        </div>

                        <button
                            onClick={() => alert('Tailwind buttons work too!')}
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Test Button (Click Me!)
                        </button>
                    </div>

                    {/* MongoDB Test Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className={`w-3 h-3 rounded-full mr-3 ${loading ? 'bg-yellow-500' :
                                    mongoStatus?.success ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                MongoDB Connection
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Testing connection...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border ${mongoStatus?.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">
                                            {mongoStatus?.success ? '✅ Connected' : '❌ Failed'}
                                        </span>
                                        <span className={`text-sm ${mongoStatus?.success ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {mongoStatus?.success ? 'Success' : 'Error'}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${mongoStatus?.success ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {mongoStatus?.message}
                                    </p>
                                </div>

                                {mongoStatus?.success && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Database:</span>
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                {mongoStatus.database}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Collections:</span>
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                                {mongoStatus.collections}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Timestamp:</span>
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                                {new Date(mongoStatus.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!mongoStatus?.success && mongoStatus?.error && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded border">
                                        <p className="text-xs text-gray-600 font-mono">
                                            Error: {mongoStatus.error}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={testMongoConnection}
                                    className="w-full mt-4 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Retry Connection
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Message */}
                {!loading && mongoStatus?.success && (
                    <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg text-center">
                        <h3 className="text-2xl font-bold mb-2">🎉 Setup Complete!</h3>
                        <p className="text-green-100">
                            Both Tailwind CSS and MongoDB are working perfectly. You're ready to start building your finance tracker!
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}