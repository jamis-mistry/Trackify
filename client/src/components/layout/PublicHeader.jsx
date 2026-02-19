import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const PublicHeader = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black border-b border-indigo-100/20 dark:border-indigo-900/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <img src="/trackify-logo.png" alt="Trackify" className="w-16 h-16 object-contain" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                        Trackify
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Features</Link>
                    <Link to="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">How it Works</Link>
                    <Link to="/testimonials" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Testimonials</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    {isAuthenticated ? (
                        <Link to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'organization' ? '/organization/dashboard' : '/user/dashboard'}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:shadow-xl transition-all duration-300"
                            >
                                Dashboard
                            </motion.button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:shadow-xl transition-all duration-300"
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
