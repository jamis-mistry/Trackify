import React from "react";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import { ClipboardList, CheckCircle, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            <PublicHeader />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                            How Trackify Works
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            A simple, transparent process to resolve issues efficiently.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Submit a Complaint</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Users can easily log complaints through their tailored dashboard.
                                    Provide details, attach relevant files, and categorize the issue for quick routing.
                                </p>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <ClipboardList size={120} className="mx-auto text-blue-500 opacity-80" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="flex-1">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Organization Review</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    The designated organization administrators receive instant notifications.
                                    They review the complaint, assign it to the right team, and update the status.
                                </p>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <Users size={120} className="mx-auto text-purple-500 opacity-80" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Resolution & Feedback</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Once resolved, the user is notified. They can verify the solution and
                                    provide feedback, ensuring the loop is closed satisfactorily.
                                </p>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <CheckCircle size={120} className="mx-auto text-green-500 opacity-80" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <Link to="/register">
                            <button className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-lg">
                                Start Your Journey <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorks;
