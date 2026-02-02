import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import { BarChart2, Shield, Users, Clock, CheckCircle, Zap } from "lucide-react";

const Home = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, -50]);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            if (user?.role === 'admin') navigate('/admin/dashboard');
            else if (user?.role === 'organization') navigate('/organization/dashboard');
            else navigate('/user/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 relative">
            {/* Fixed Live Background */}


            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Trackify v2.0 is live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8"
                    >
                        Complaint Management <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Reimagined.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Streamline issue tracking, enhance user satisfaction, and resolve complaints faster than ever. The all-in-one platform for modern organizations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetStarted}
                            className="h-14 px-10 text-lg font-bold text-white shadow-xl shadow-indigo-600/30 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                        >
                            {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                        </motion.button>
                        <Link to="/login" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-14 px-10 text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-900/30 border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 shadow-lg shadow-indigo-200/50 dark:shadow-none rounded-xl transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                            >
                                Login to Account
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats Dashboard Preview Mockup */}
                    <motion.div
                        style={{ y: y }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 shadow-2xl overflow-hidden backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 pointer-events-none"></div>
                        <div className="p-2 bg-gray-100/80 dark:bg-gray-800/80 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex gap-1.5 ml-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                        </div>
                        <div className="aspect-[16/9] flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-black/20">
                            {/* In a real app, put a screenshot image here */}
                            <div className="text-center p-12">
                                <BarChart2 size={64} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Interactive Dashboard Interface</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-2"
                        >
                            Features
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                        >
                            Everything you need to succeed
                        </motion.h3>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={Zap}
                            title="Real-time Tracking"
                            description="Monitor complaints as they happen. Get instant notifications and updates."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Secure Role Management"
                            description="Dedicated portals for Admins, Organizations, and Users with granular permissions."
                        />
                        <FeatureCard
                            icon={BarChart2}
                            title="Analytics & Reports"
                            description="Gain insights into complaint trends and resolution times with detailed charts."
                        />
                        <FeatureCard
                            icon={Users}
                            title="User Management"
                            description="Easily onboard and manage users within your organization."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="History Logs"
                            description="Keep a complete audit trail of every action taken on a complaint."
                        />
                        <FeatureCard
                            icon={CheckCircle}
                            title="Resolution Workflow"
                            description="Structured workflows ensuring every issue reaches a satisfactory conclusion."
                        />
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden bg-gray-900 dark:bg-black">
                {/* Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/50 to-purple-900/50 opacity-40"></div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[100px]"
                    />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center text-white relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Ready to transform <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">your workflow?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-indigo-100/80 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join thousands of organizations using Trackify to build better relationships and resolve issues faster than ever before.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-6"
                    >
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="h-16 px-10 text-xl font-bold text-white shadow-xl shadow-indigo-600/40 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                            >
                                Start Free Trial
                            </motion.button>
                        </Link>
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="h-16 px-10 text-xl font-bold bg-white/5 border border-white/20 hover:border-white/40 text-white rounded-2xl backdrop-blur-sm transition-all w-full sm:w-auto"
                            >
                                Contact Sales
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-default"
    >
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
            <Icon size={24} />
        </div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

export default Home;
