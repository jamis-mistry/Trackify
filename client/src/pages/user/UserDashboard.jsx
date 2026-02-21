import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ClipboardList, Clock, CheckCircle, AlertCircle, PlusCircle, Activity } from "lucide-react";
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
          {/* Hack: */}
          <div className="absolute inset-0 bg-transparent" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const { user, getMockComplaints } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const filters = user?.organizationName ? { organization: user.organizationName } : { userId: user?._id || user?.id };
      const complaints = await getMockComplaints(filters);
      setStats({
        total: complaints.length,
        open: complaints.filter(c => c.status === "Open").length,
        inProgress: complaints.filter(c => c.status === "In Progress").length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
      });
    };
    fetchStats();
  }, [user, getMockComplaints]);

  return (
    <DashboardLayout role="user">
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
                My Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Track your requests and status updates.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/user/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 font-bold flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  New Complaint
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlowingStatCard
              title="Total Complaints"
              value={stats.total}
              label="Total Complaints"
              icon={ClipboardList}
              color="from-blue-400 to-blue-600"
            />
            <GlowingStatCard
              title="Open"
              value={stats.open}
              label="Pending Review"
              icon={AlertCircle}
              color="from-yellow-400 to-orange-500"
            />
            <GlowingStatCard
              title="In Progress"
              value={stats.inProgress}
              label="Being Processed"
              icon={Clock}
              color="from-purple-400 to-indigo-600"
            />
            <GlowingStatCard
              title="Resolved"
              value={stats.resolved}
              label="Completed"
              icon={CheckCircle}
              color="from-emerald-400 to-green-600"
            />
          </div>

          {/* Main Content Area */}
          <div className="mt-8">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity className="text-emerald-500" />
                  My Recent Activity
                </h2>
              </div>

              {/* Placeholder for activity steam */}
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                  <Activity className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">Your latest actions will appear here.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
