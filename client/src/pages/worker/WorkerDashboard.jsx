import React, { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import MetricCard from "../../components/dashboard/MetricCard";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle, Clock, AlertCircle, Bell, BellOff, Settings, Tag,
    Building2, Wrench, History, ChevronRight, X, Filter
} from "lucide-react";

const CATEGORIES = ["Technical", "Service", "Billing", "Infrastructure", "Other"];

const WorkerDashboard = () => {
    const { user, getWorkerAssignments, updateWorkerProfile } = useContext(AuthContext);
    const [assignments, setAssignments] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(
        user?.workerCategories || []
    );
    const [savingCategories, setSavingCategories] = useState(false);
    const [showCategoryPanel, setShowCategoryPanel] = useState(false);
    const [categoryMsg, setCategoryMsg] = useState("");

    const isInOrg = !!(user?.organizationName);

    useEffect(() => {
        if (isInOrg && getWorkerAssignments) {
            const all = getWorkerAssignments(user._id || user.id);
            setAssignments(all);
        }
        if (user?.workerCategories) setSelectedCategories(user.workerCategories);
    }, [user]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const saveCategories = async () => {
        setSavingCategories(true);
        try {
            if (updateWorkerProfile) {
                await updateWorkerProfile({ workerCategories: selectedCategories });
            }
            setCategoryMsg("Categories saved!");
            setTimeout(() => setCategoryMsg(""), 2500);
        } catch (e) {
            setCategoryMsg("Error saving.");
        } finally {
            setSavingCategories(false);
        }
    };

    const pending = assignments.filter(a => a.status === "Open" || a.status === "In Progress");
    const completed = assignments.filter(a => a.status === "Resolved");
    const highPriority = assignments.filter(a => a.priority === "High");

    return (
        <DashboardLayout role="worker">

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Hello, {user?.name?.split(" ")[0]}! 👷
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {isInOrg
                                ? `Working at ${user.organizationName}`
                                : "You are not assigned to any organization yet."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors font-medium text-sm"
                        >
                            <Filter size={16} />
                            My Categories
                        </button>
                        <Link
                            to="/worker/history"
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl border border-orange-100 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors font-medium text-sm"
                        >
                            <History size={16} />
                            Work History
                        </Link>
                    </div>
                </div>

                {/* Category Selection Panel */}
                <AnimatePresence>
                    {showCategoryPanel && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag size={18} className="text-indigo-500" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Your Work Categories</h3>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                                    Choose the categories you specialize in. You'll receive tasks matching these categories.
                                </p>
                                <div className="flex flex-wrap gap-3 mb-5">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${selectedCategories.includes(cat)
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105"
                                                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                                                }`}
                                        >
                                            {selectedCategories.includes(cat) && "✓ "}{cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={saveCategories}
                                        disabled={savingCategories}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60"
                                    >
                                        {savingCategories ? "Saving..." : "Save Categories"}
                                    </button>
                                    {categoryMsg && (
                                        <span className={`text-sm font-medium ${categoryMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                                            {categoryMsg}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Not in org warning */}
                {!isInOrg && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8 flex items-start gap-4"
                    >
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                            <Building2 size={24} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-lg">Not yet assigned to an organization</h3>
                            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                                You need to be added by an organization admin to see your assigned tasks and work history. Please contact your organization administrator.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Metrics */}
                {isInOrg && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <MetricCard
                            title="Active Tasks"
                            value={pending.length.toString()}
                            icon={Clock}
                            color="blue"
                            trend={pending.length > 0 ? `${pending.length} in progress` : "No active tasks"}
                        />
                        <MetricCard
                            title="Completed"
                            value={completed.length.toString()}
                            icon={CheckCircle}
                            color="green"
                            trend="Total resolved"
                        />
                        <MetricCard
                            title="High Priority"
                            value={highPriority.length.toString()}
                            icon={AlertCircle}
                            color="red"
                            trend={highPriority.length > 0 ? "Needs attention" : "All clear"}
                        />
                    </div>
                )}

                {/* Assigned Tasks or Org Block */}
                {isInOrg ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Wrench size={18} className="text-indigo-500" /> Current Assignments
                            </h3>
                            <Link
                                to="/worker/assignments"
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                            >
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {pending.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <CheckCircle size={40} className="mx-auto mb-3 text-green-300" />
                                <p className="font-medium">No active assignments right now.</p>
                                <p className="text-sm mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pending.slice(0, 5).map((task, i) => (
                                    <motion.div
                                        key={task._id || task.id || i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-2 h-8 rounded-full flex-shrink-0 ${task.priority === "High" ? "bg-red-500" :
                                                task.priority === "Medium" ? "bg-yellow-400" : "bg-green-400"
                                                }`} />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{task.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-400">{task.category}</span>
                                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${task.status === "In Progress"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                        }`}>{task.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ml-2 flex-shrink-0 ${task.priority === "High" ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                                            task.priority === "Medium" ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" :
                                                "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                            }`}>{task.priority}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">Assignments Locked</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-sm mx-auto">
                            Your assigned tasks will appear here once an organization adds you as a worker.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WorkerDashboard;
