import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Users, Shield, User, FileText, AlertCircle, CheckCircle, TrendingUp, Activity, Plus } from "lucide-react";
import { Link } from "react-router-dom";

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

const GlowingStatCard = ({ icon: Icon, label, value, color, delay }) => (
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
          {/* Hack to show icon color properly since mix-blend might fail in some contexts, simplified: */}
          <div className="absolute inset-0 bg-transparent" />
        </div>
        <span className="flex items-center text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-100 dark:border-green-800">
          <TrendingUp size={12} className="mr-1" />
          +12%
        </span>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
);


const OrgDashboard = () => {
  // Mock data
  const stats = {
    totalUsers: 25,
    admins: 3,
    users: 22,
    totalComplaints: 68,
    open: 18,
    resolved: 40,
  };

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
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg shadow-blue-500/30 font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                New User
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <GlowingStatCard
              icon={Users}
              label="Total Members"
              value={stats.totalUsers}
              color="from-blue-400 to-blue-600"
            />
            <GlowingStatCard
              icon={FileText}
              label="Total Complaints"
              value={stats.totalComplaints}
              color="from-orange-400 to-pink-600"
            />
            <GlowingStatCard
              icon={CheckCircle}
              label="Resolved Issues"
              value={stats.resolved}
              color="from-green-400 to-emerald-600"
            />
            <GlowingStatCard
              icon={AlertCircle}
              label="Open Issues"
              value={stats.open}
              color="from-yellow-400 to-orange-500"
            />
            <GlowingStatCard
              icon={Shield}
              label="Admins"
              value={stats.admins}
              color="from-purple-400 to-indigo-600"
            />
            <GlowingStatCard
              icon={User}
              label="Staff"
              value={stats.users}
              color="from-slate-400 to-slate-600"
            />
          </div>

          {/* Recent Activity / Quick Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity className="text-blue-500" />
                  Recent Activity
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">View All</button>
              </div>

              <div className="space-y-4">
                {/* Empty State Placeholder with better styling */}
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                    <Activity className="text-slate-400" size={32} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No recent updates</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Activity will appear here once you start managing complaints.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-lg font-bold mb-2 relative z-10">Manage Users</h3>
                <p className="text-blue-100 text-sm mb-4 relative z-10">Add, remove, or update organization members.</p>
                <Link to="/organization/users" className="inline-flex items-center justify-center w-full py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors relative z-10">
                  Go to Users
                </Link>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-lg font-bold mb-2 relative z-10">Complaints</h3>
                <p className="text-indigo-100 text-sm mb-4 relative z-10">Review and resolve open organization issues.</p>
                <Link to="/organization/complaints" className="inline-flex items-center justify-center w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 transition-colors relative z-10">
                  View Complaints
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default OrgDashboard;
