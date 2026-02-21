import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, X, CheckCheck, AlertTriangle,
    FileText, BarChart2, ChevronRight, Info
} from "lucide-react";

const typeConfig = {
    new_complaint: {
        icon: FileText,
        gradient: "from-orange-400 to-pink-500",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-100 dark:border-orange-800",
        label: "New Complaint",
    },
    worker_update: {
        icon: BarChart2,
        gradient: "from-indigo-500 to-violet-600",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        border: "border-indigo-100 dark:border-indigo-800",
        label: "Worker Update",
    },
    assignment: {
        icon: FileText,
        gradient: "from-blue-400 to-indigo-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-100 dark:border-blue-800",
        label: "New Assignment",
    },
    default: {
        icon: Info,
        gradient: "from-slate-400 to-slate-600",
        bg: "bg-slate-50 dark:bg-slate-800",
        border: "border-slate-200 dark:border-slate-700",
        label: "Notification",
    },
};

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const panelRef = useRef(null);

    const getNotifKey = () => {
        const id = user?._id || user?.id;
        if (!id) return null;
        return `trackify_notifs_${id}`;
    };

    const loadNotifications = () => {
        const key = getNotifKey();
        if (!key) return;
        const raw = localStorage.getItem(key);
        setNotifications(raw ? JSON.parse(raw) : []);
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        const key = getNotifKey();
        if (!key) return;
        const updated = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem(key, JSON.stringify(updated));
        setNotifications(updated);
    };

    const dismiss = (id) => {
        const key = getNotifKey();
        if (!key) return;
        const updated = notifications.filter(n => n.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
        setNotifications(updated);
    };

    const clearAll = () => {
        const key = getNotifKey();
        if (!key) return;
        localStorage.removeItem(key);
        setNotifications([]);
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => { setOpen(!open); if (!open) loadNotifications(); }}
                className="relative p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800"
                title="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
                    />
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute right-0 mt-3 w-80 md:w-[380px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-[100]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-indigo-500" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                        <CheckCheck size={14} /> Mark read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center px-6">
                                    <Bell size={36} className="opacity-20 mb-3" />
                                    <p className="text-sm font-medium">No notifications yet</p>
                                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                                        We'll let you know when there's an update for you.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notif, i) => {
                                    const cfg = typeConfig[notif.type] || typeConfig.default;
                                    const Icon = cfg.icon;
                                    return (
                                        <div
                                            key={notif.id || i}
                                            className={`flex gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                                        >
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm`}>
                                                <Icon size={16} className="text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-1">
                                                        {notif.title}
                                                    </p>
                                                    <button
                                                        onClick={() => dismiss(notif.id)}
                                                        className="flex-shrink-0 text-slate-300 hover:text-slate-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className="text-[10px] text-slate-400">{notif.time || "Recently"}</span>
                                                    {!notif.read && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
