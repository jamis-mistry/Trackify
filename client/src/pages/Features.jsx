import React from "react";
import { motion } from "framer-motion";
import {
    Zap, Shield, BarChart2, Users, Clock, CheckCircle,
    Lock, Globe, Smartphone, Mail, FileText, Bell
} from "lucide-react";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

const Features = () => {
    return (
        <div className="min-h-screen transition-colors duration-300 relative">

            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-100 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400"
                    >
                        Powerful Capabilities
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
                    >
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            manage complaints effectively
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Trackify offers a comprehensive suite of tools designed to streamline issue resolution, enhance communication, and provide actionable insights for your organization.
                    </motion.p>
                </div>
            </section>

            {/* Detailed Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureDetailCard
                        icon={Zap}
                        title="Real-time Updates"
                        description="Experience zero-latency updates. When a complaint status changes or a comment is added, everyone involved sees it instantly without refreshing."
                    />
                    <FeatureDetailCard
                        icon={Shield}
                        title="Enterprise-Grade Security"
                        description="Your data is protected with state-of-the-art encryption. Role-based access control ensures sensitive information is only accessible to authorized personnel."
                    />
                    <FeatureDetailCard
                        icon={BarChart2}
                        title="Advanced Analytics"
                        description="Visualize your performance with interactive charts. Track resolution times, complaint volume trends, and user satisfaction scores."
                    />
                    <FeatureDetailCard
                        icon={Users}
                        title="Team Collaboration"
                        description="Assign complaints to specific team members, leave internal notes, and mention colleagues to bring them into the conversation."
                    />
                    <FeatureDetailCard
                        icon={Clock}
                        title="SLA Tracking"
                        description="Set Service Level Agreements (SLAs) for different priority levels. Get automatic alerts when a ticket is approaching its deadline."
                    />
                    <FeatureDetailCard
                        icon={CheckCircle}
                        title="Automated Workflows"
                        description="Define custom workflows for different types of complaints. Automate status transitions and notifications to save manual effort."
                    />
                    <FeatureDetailCard
                        icon={Globe}
                        title="Multi-channel Support"
                        description="Accept complaints from various sources including email, web forms, and mobile apps, all centralized in one dashboard."
                    />
                    <FeatureDetailCard
                        icon={Bell}
                        title="Smart Notifications"
                        description="Customizable notification preferences ensure you never miss an important update while avoiding alert fatigue."
                    />
                    <FeatureDetailCard
                        icon={FileText}
                        title="Audit Logging"
                        description="Maintain a complete audit trail of every action taken within the system for compliance and accountability."
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your workflow?</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of forward-thinking organizations that trust Trackify for their complaint management needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                            <Link to="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-indigo-700/50 border border-white/20 text-white rounded-xl font-bold text-lg backdrop-blur-sm hover:bg-indigo-700/70 transition-all"
                                >
                                    Contact Sales
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureDetailCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
        <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default Features;
