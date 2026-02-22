import React, { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardList, Building2, Clock, CheckCircle, AlertCircle,
    Search, Filter, Tag, Calendar, ChevronDown, ChevronUp,
    Send, ListChecks, Pencil, X, BarChart2
} from "lucide-react";

const STATUSES_FILTER = ["All", "Open", "In Progress", "Resolved"];
const STATUSES_UPDATE = ["Open", "In Progress", "Resolved"];

const statusConfig = {
    "Open": { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800", icon: AlertCircle },
    "In Progress": { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: Clock },
    "Resolved": { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800", icon: CheckCircle },
};

const priorityColor = {
    "High": "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    "Medium": "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    "Low": "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
};

// Inline progress update panel
const ProgressPanel = ({ task, onSave, onClose }) => {
    const [progress, setProgress] = useState(task.progress ?? 0);
    const [status, setStatus] = useState(task.status || "In Progress");
    const [workNote, setWorkNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(task._id || task.id, { progress, status, workNote });
            setSaved(true);
            setTimeout(() => { setSaved(false); onClose(); }, 900);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const remaining = 100 - progress;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden"
        >
            <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-900/40 rounded-b-2xl bg-indigo-50/40 dark:bg-indigo-950/20 px-5 pb-5 -mx-5 -mb-5">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
                    <BarChart2 size={16} />
                    Update Progress
                </div>

                {/* Progress Slider */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Completion: <span className="text-indigo-600 dark:text-indigo-400 text-base font-extrabold">{progress}%</span>
                        </label>
                        <span className="text-xs text-slate-400">
                            {remaining}% remaining
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0} max={100} step={5}
                        value={progress}
                        onChange={e => setProgress(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-2 rounded-full cursor-pointer"
                    />
                    {/* Visual progress bar */}
                    <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 120 }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Status</label>
                    <div className="flex gap-2 flex-wrap">
                        {STATUSES_UPDATE.map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${status === s
                                    ? statusConfig[s]?.color + " ring-2 ring-offset-1 ring-indigo-400"
                                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Work Note */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                        Work Note <span className="text-slate-400 font-normal">(what did you do?)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={workNote}
                        onChange={e => setWorkNote(e.target.value)}
                        placeholder="e.g. Diagnosed the server issue, updated config files, restarted services..."
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
                    />
                    <p className="text-right text-xs text-slate-400 mt-1">{workNote.length}/300</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl disabled:opacity-60 flex items-center gap-2 shadow-sm shadow-indigo-400/30 transition-all"
                    >
                        {saved ? (
                            <><CheckCircle size={14} /> Saved!</>
                        ) : saving ? (
                            "Saving..."
                        ) : (
                            <><Send size={14} /> Submit Update</>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Work Log mini-timeline
const WorkLog = ({ log }) => {
    if (!log?.length) return (
        <p className="text-xs text-slate-400 italic mt-2">No work notes yet.</p>
    );
    return (
        <div className="mt-3 space-y-2">
            {log.slice().reverse().map((entry, i) => (
                <div key={i} className="flex gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{entry.progress}% — </span>
                        <span className="text-slate-600 dark:text-slate-400">{entry.note}</span>
                        <span className="block text-slate-400 text-[11px] mt-0.5">
                            {entry.by} · {entry.at ? new Date(entry.at).toLocaleString() : ""}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const WorkerAssignments = () => {
    const { user, getWorkerAssignments, updateTaskProgress, categories } = useContext(AuthContext);

    const workerCategories = categories
        .filter(c => c.type === 'worker')
        .map(c => c.name);

    const CATEGORIES = ["All", ...workerCategories];

    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null); // which card is showing update panel
    const [showLogId, setShowLogId] = useState(null);   // which card is showing work log

    const isInOrg = !!(user?.organizationName);

    const loadAssignments = () => {
        if (isInOrg && getWorkerAssignments) {
            const data = getWorkerAssignments(user?._id || user?.id);
            setAssignments(Array.isArray(data) ? data : []);
        }
        setLoading(false);
    };

    useEffect(() => { loadAssignments(); }, [user]);

    const handleProgressSave = async (complaintId, updates) => {
        await updateTaskProgress(complaintId, updates);
        // Reload from localStorage
        loadAssignments();
    };

    const filtered = assignments.filter(a => {
        const matchSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = filterCategory === "All" || a.category === filterCategory;
        const matchStatus = filterStatus === "All" || a.status === filterStatus;
        return matchSearch && matchCat && matchStatus;
    });

    return (
        <DashboardLayout role="worker">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <ClipboardList size={28} />
                        </div>
                        My Assignments
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1">
                        Tasks assigned to you · update progress and leave work notes
                    </p>
                </div>

                {/* Not in org */}
                {!isInOrg ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800"
                    >
                        <div className="p-5 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-5">
                            <Building2 size={48} className="text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2">
                            Organization Required
                        </h3>
                        <p className="text-amber-600 dark:text-amber-400 text-center max-w-md text-sm leading-relaxed">
                            You haven't been added to any organization yet. Once an organization admin adds you as a worker, your assigned tasks will appear here.
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {/* Search & Filters */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search assignments..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                                    className="pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm appearance-none">
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    className="pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm appearance-none">
                                    {STATUSES_FILTER.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>

                        {/* Task List */}
                        {loading ? (
                            <div className="text-center py-16 text-gray-400">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-4">
                                    <ClipboardList className="text-indigo-400" size={44} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">No assignments found</h3>
                                <p className="text-gray-400 text-center max-w-sm text-sm">
                                    {assignments.length === 0 ? "You don't have any tasks assigned to you yet." : "No tasks match your current filters."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filtered.map((task, i) => {
                                    const StatusIcon = statusConfig[task.status]?.icon || AlertCircle;
                                    const prog = task.progress ?? 0;
                                    const isExpanded = expandedId === (task._id || task.id);
                                    const isLogOpen = showLogId === (task._id || task.id);
                                    const taskId = task._id || task.id;

                                    return (
                                        <motion.div
                                            key={taskId || i}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all overflow-hidden"
                                        >
                                            <div className="p-5">
                                                {/* Header row */}
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusConfig[task.status]?.color || ""}`}>
                                                                <StatusIcon size={12} /> {task.status}
                                                            </span>
                                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${priorityColor[task.priority] || ""}`}>
                                                                {task.priority} Priority
                                                            </span>
                                                            <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                                                                {task.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 text-right flex-shrink-0">
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Calendar size={11} />
                                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}
                                                        </span>
                                                        {task.assignedDate && (
                                                            <span className="text-xs text-indigo-500 font-medium">
                                                                Assigned {new Date(task.assignedDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between items-center mb-1 text-xs">
                                                        <span className="font-semibold text-slate-600 dark:text-slate-300">Progress</span>
                                                        <span className={`font-extrabold ${prog === 100 ? 'text-green-600' : prog > 50 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                            {prog}% done · {100 - prog}% left
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${prog === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                                                prog > 60 ? 'bg-gradient-to-r from-indigo-500 to-violet-500' :
                                                                    'bg-gradient-to-r from-blue-400 to-indigo-500'
                                                                }`}
                                                            style={{ width: `${prog}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Footer actions */}
                                                <div className="mt-4 flex items-center justify-end flex-wrap gap-3">
                                                    <div className="flex gap-2 ml-auto">
                                                        {/* Toggle work log */}
                                                        <button
                                                            onClick={() => setShowLogId(isLogOpen ? null : taskId)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                                                        >
                                                            <ListChecks size={13} />
                                                            {isLogOpen ? "Hide Log" : "Work Log"}
                                                            {task.workLog?.length > 0 && (
                                                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                                                                    {task.workLog.length}
                                                                </span>
                                                            )}
                                                        </button>
                                                        {/* Toggle update panel */}
                                                        <button
                                                            onClick={() => setExpandedId(isExpanded ? null : taskId)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                                                        >
                                                            {isExpanded ? <><X size={13} /> Cancel</> : <><Pencil size={13} /> Update Progress</>}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Work Log */}
                                                <AnimatePresence>
                                                    {isLogOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                                                    <ListChecks size={13} className="text-indigo-500" />
                                                                    Work Log
                                                                </p>
                                                                <WorkLog log={task.workLog} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Update Progress Panel */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <ProgressPanel
                                                            task={task}
                                                            onSave={handleProgressSave}
                                                            onClose={() => setExpandedId(null)}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default WorkerAssignments;
