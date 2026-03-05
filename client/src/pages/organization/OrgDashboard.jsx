import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, FileText, CheckCircle, TrendingUp, Activity, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const GlowingStatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group h-full"
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500`} />

    <div className="relative h-full bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-10`} />

      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-inner`}>
          <Icon size={24} className="mix-blend-overlay" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
);


const OrgDashboard = () => {
  const { getOrgStats } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await getOrgStats();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, [getOrgStats]);

  return (
    <DashboardLayout role="organization">
      <div className="relative min-h-[calc(100vh-100px)]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                Organization Overview
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Welcome back! Here's what's happening in your organization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlowingStatCard
              icon={Users}
              label="Total Members"
              value={loading ? "..." : stats.totalMembers}
              color="from-indigo-500 to-blue-500"
            />
            <GlowingStatCard
              icon={FileText}
              label="Active Complaints"
              value={loading ? "..." : stats.openComplaints}
              color="from-orange-500 to-red-500"
            />
            <GlowingStatCard
              icon={CheckCircle}
              label="Resolved Cases"
              value={loading ? "..." : stats.resolvedComplaints}
              color="from-emerald-500 to-teal-500"
            />
            <GlowingStatCard
              icon={Activity}
              label="Total Requests"
              value={loading ? "..." : stats.totalComplaints}
              color="from-purple-500 to-indigo-500"
            />
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <Link to="/organization/users" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Users size={18} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">View Users</span>
                  </Link>
                  <Link to="/organization/complaints" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Browse Complaints</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <Activity className="text-indigo-500" size={20} />
                  System Activity
                </h2>
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <Activity className="text-slate-400 mb-3" size={32} />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring active...</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Live system updates will appear here.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default OrgDashboard;
