import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { History, Clock, CheckCircle, AlertCircle, XCircle, Search, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100 }
    }
};

const UserHistory = () => {
    const { user, getMockComplaints } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            if (user?._id) {
                try {
                    // Fetch all complaints for now, effectively "History"
                    // In a real app, this might be filtered by status "Resolved" or sorted by date
                    const data = await getMockComplaints(user._id);
                    setHistory(Array.isArray(data) ? data : []);
                } catch (e) {
                    console.error("Failed to load history", e);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [user]);

    const filteredHistory = history.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status) => {
        switch (status) {
            case "Open": return { color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400", icon: AlertCircle };
            case "In Progress": return { color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400", icon: Clock };
            case "Resolved": return { color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400", icon: CheckCircle };
            case "Rejected": return { color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400", icon: XCircle };
            default: return { color: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400", icon: AlertCircle };
        }
    };

    return (
        <DashboardLayout role="user">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* Background FX */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-orange-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto"
                >
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                    <History size={32} />
                                </div>
                                Activity History
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                                Timeline of your reported issues and updates
                            </p>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search history..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-700">
                        {loading ? (
                            <div className="text-center py-12 text-slate-400">Loading history...</div>
                        ) : filteredHistory.length > 0 ? (
                            filteredHistory.map((item, index) => {
                                const StatusIcon = getStatusConfig(item.status).icon;
                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                    >
                                        {/* Timeline Icon */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 translate-x-0 z-10">
                                            <StatusIcon size={18} className={getStatusConfig(item.status).color.split(' ')[0]} />
                                        </div>

                                        {/* Content Card */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusConfig(item.status).color}`}>
                                                    {item.status}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 hover:text-orange-500 transition-colors">
                                                <Link to={`/complaints/${item.id}`}>{item.title}</Link>
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                                                <span className="text-xs font-mono text-slate-400">ID: {item.id}</span>
                                                <Link to={`/complaints/${item.id}`} className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:gap-2 transition-all">
                                                    Details <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="relative text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 ml-12 md:ml-0">
                                <History className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No history found</h3>
                                <p className="text-slate-500 dark:text-slate-400">You haven't submitted any complaints yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default UserHistory;
