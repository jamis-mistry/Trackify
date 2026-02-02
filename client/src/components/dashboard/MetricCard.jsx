import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 }
    }
};

const getColorClasses = (color) => {
    const colors = {
        blue: {
            gradient: "from-blue-400 to-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/30",
            text: "text-blue-500",
            border: "border-blue-100 dark:border-blue-800"
        },
        green: {
            gradient: "from-green-400 to-emerald-600",
            bg: "bg-green-50 dark:bg-green-900/30",
            text: "text-green-500",
            border: "border-green-100 dark:border-green-800"
        },
        red: {
            gradient: "from-red-400 to-red-600",
            bg: "bg-red-50 dark:bg-red-900/30",
            text: "text-red-500",
            border: "border-red-100 dark:border-red-800"
        },
        orange: {
            gradient: "from-yellow-400 to-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/30",
            text: "text-orange-500",
            border: "border-orange-100 dark:border-orange-800"
        },
        purple: {
            gradient: "from-purple-400 to-indigo-600",
            bg: "bg-purple-50 dark:bg-purple-900/30",
            text: "text-purple-500",
            border: "border-purple-100 dark:border-purple-800"
        },
    };
    return colors[color] || colors.blue;
};

const MetricCard = ({ icon: Icon, title, value, color, trend, delay }) => {
    const colorClasses = getColorClasses(color);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group h-full"
        >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses.gradient} rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500`} />

            <div className="relative h-full bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses.gradient} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-10`} />

                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses.gradient} bg-opacity-10 text-white shadow-inner`}>
                        <Icon size={24} className="mix-blend-overlay" />
                        <div className="absolute inset-0 bg-transparent" />
                    </div>
                    {trend && (
                        <span className={`flex items-center text-xs font-semibold ${colorClasses.text} ${colorClasses.bg} px-2 py-1 rounded-full border ${colorClasses.border}`}>
                            <TrendingUp size={12} className="mr-1" />
                            {trend}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{title}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default MetricCard;
