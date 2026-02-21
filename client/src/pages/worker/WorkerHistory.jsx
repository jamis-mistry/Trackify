import React, { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
    History, CheckCircle, Clock, AlertCircle, XCircle,
    Search, Calendar, Building2, Tag, Filter, ChevronDown
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
    hidden: { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
};

const getStatusConfig = (status) => {
    switch (status) {
        case "Open": return { color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800", icon: AlertCircle };
        case "In Progress": return { color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: Clock };
        case "Resolved": return { color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800", icon: CheckCircle };
        case "Rejected": return { color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800", icon: XCircle };
        default: return { color: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400", icon: AlertCircle };
    }
};

const CATEGORIES = ["All", "Technical", "Service", "Billing", "Infrastructure", "Other"];
const STATUSES = ["All", "Open", "In Progress", "Resolved", "Rejected"];

const WorkerHistory = () => {
    const { user, getWorkerAssignments } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCat, setFilterCat] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");

    const isInOrg = !!(user?.organizationName);

    useEffect(() => {
        if (isInOrg && getWorkerAssignments) {
            const data = getWorkerAssignments(user?._id || user?.id);
            setHistory(Array.isArray(data) ? data : []);
        }
        setLoading(false);
    }, [user]);

    const filtered = history.filter(item => {
        const matchSearch =
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = filterCat === "All" || item.category === filterCat;
        const matchStatus = filterStatus === "All" || item.status === filterStatus;
        return matchSearch && matchCat && matchStatus;
    });

    const stats = {
        total: history.length,
        resolved: history.filter(h => h.status === "Resolved").length,
        inProgress: history.filter(h => h.status === "In Progress").length,
        open: history.filter(h => h.status === "Open").length,
    };

    return (
        <DashboardLayout role="worker">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* BG FX */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-violet-400/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                                <History size={28} />
                            </div>
                            Work History
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                            All tasks that have been assigned to you
                        </p>
                    </div>

                    {!isInOrg ? (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800"
                        >
                            <div className="p-5 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-5">
                                <Building2 size={48} className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2">No Organization</h3>
                            <p className="text-amber-600 dark:text-amber-400 text-center max-w-md text-sm">
                                Your work history will appear here once you're added to an organization.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: "Total Tasks", value: stats.total, color: "from-indigo-500 to-violet-600" },
                                    { label: "Resolved", value: stats.resolved, color: "from-green-500 to-emerald-600" },
                                    { label: "In Progress", value: stats.inProgress, color: "from-blue-500 to-cyan-600" },
                                    { label: "Pending", value: stats.open, color: "from-yellow-500 to-orange-500" },
                                ].map(stat => (
                                    <div key={stat.label} className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl text-white shadow-sm`}>
                                        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-3xl font-extrabold mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Search + Filters */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search history..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    <select
                                        value={filterCat}
                                        onChange={e => setFilterCat(e.target.value)}
                                        className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/20 outline-none text-sm appearance-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    <select
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                        className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/20 outline-none text-sm appearance-none"
                                    >
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>

                            {/* Timeline */}
                            {loading ? (
                                <div className="text-center py-12 text-slate-400">Loading history...</div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <History className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No history found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        {history.length === 0 ? "No tasks have been assigned to you yet." : "No items match your current filters."}
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent dark:before:via-gray-700"
                                >
                                    {filtered.map((item, index) => {
                                        const { icon: StatusIcon, color } = getStatusConfig(item.status);
                                        return (
                                            <motion.div
                                                key={item._id || item.id || index}
                                                variants={itemVariants}
                                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                                            >
                                                {/* Timeline Icon */}
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 translate-x-0 z-10">
                                                    <StatusIcon size={18} className={color.split(' ')[0]} />
                                                </div>

                                                {/* Card */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all">
                                                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${color}`}>
                                                                {item.status}
                                                            </span>
                                                            {item.category && (
                                                                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                            {item.priority && (
                                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${item.priority === "High"
                                                                    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                                                    : item.priority === "Medium"
                                                                        ? "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                                                        : "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                                    }`}>
                                                                    {item.priority}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Calendar size={11} />
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                                        {item.description}
                                                    </p>
                                                    {item.assignedDate && (
                                                        <div className="pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                                                            <span>Assigned: {new Date(item.assignedDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkerHistory;
