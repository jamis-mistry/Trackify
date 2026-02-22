import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { Users, Building2, FileText, CheckCircle, ArrowRight, Sparkles, Tag, Briefcase } from "lucide-react";

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

const AdminDashboard = () => {
  const { getMockUsers, getMockComplaints } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    totalUsers: 0,
    totalOrgs: 0,
    totalWorkers: 0,
    open: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data (using new async adapters)
        const allUsers = await getMockUsers(); // Need to ensure this is handled if it becomes async later
        const allComplaints = await getMockComplaints();

        // Safe check for arrays
        const usersList = Array.isArray(allUsers) ? allUsers : [];
        const complaintsList = Array.isArray(allComplaints) ? allComplaints : [];

        // User Stats
        const totalUsers = usersList.length;
        const organizations = usersList.filter(u => u.role === 'organization').length;
        const workers = usersList.filter(u => u.role === 'worker').length;
        const regularUsers = usersList.filter(u => u.role === 'user').length;

        // Complaint Stats
        const open = complaintsList.filter(c => c.status === 'Open').length;
        const resolved = complaintsList.filter(c => c.status === 'Resolved').length;

        setStats({
          totalComplaints: complaintsList.length,
          totalUsers: regularUsers,
          totalOrgs: organizations,
          totalWorkers: workers,
          open,
          resolved
        });
      } catch (error) {
        console.error("Dashboard data load error", error);
      }
    };

    fetchData();
  }, [getMockUsers, getMockComplaints]);

  return (
    <DashboardLayout role="admin">
      <div className="relative">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Super Admin Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">System Overview & Analytics</p>
            </div>
          </motion.div>

          {/* Stats Grid with Glowing Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            <GlowingStatCard
              icon={Building2}
              label="Total Organizations"
              value={stats.totalOrgs}
              color="from-blue-500 to-cyan-400"
              delay={0}
            />
            <GlowingStatCard
              icon={Briefcase}
              label="Total Workers"
              value={stats.totalWorkers}
              color="from-amber-500 to-orange-400"
              delay={0.1}
            />
            <GlowingStatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="from-indigo-500 to-purple-500"
              delay={0.2}
            />
            <GlowingStatCard
              icon={FileText}
              label="Total Complaints"
              value={stats.totalComplaints}
              color="from-fuchsia-500 to-pink-500"
              delay={0.3}
            />
            <GlowingStatCard
              icon={CheckCircle}
              label="Resolved Issues"
              value={stats.resolved}
              color="from-emerald-500 to-teal-400"
              delay={0.4}
            />
          </div>

          {/* Quick Actions / Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PremiumActionCard
              title="View Organizations"
              description={`Access directory of ${stats.totalOrgs} organizations.`}
              icon={Building2}
              href="/admin/organizations"
              gradient="from-blue-600 to-cyan-500"
            />

            <PremiumActionCard
              title="Manage Users"
              description={`Control roles and permissions for ${stats.totalUsers} platform users.`}
              icon={Users}
              href="/admin/users"
              gradient="from-indigo-600 to-purple-600"
            />

            <PremiumActionCard
              title="Manage Categories"
              description="Configure worker and issue categories."
              icon={Tag}
              href="/admin/categories"
              gradient="from-fuchsia-600 to-pink-600"
            />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

const GlowingStatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    {/* Animated Gradient Border */}
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500`} />

    <div className="relative h-full bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between overflow-hidden">
      {/* Subtle background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-10`} />

      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 uppercase tracking-wider">
          {label.split(" ")[1]}
        </span>
      </div>

      <div>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  </motion.div>
);

const PremiumActionCard = ({ title, description, icon: Icon, href, gradient }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group relative cursor-pointer"
      onClick={() => window.location.href = href}
    >
      {/* Border Gradient */}
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500`} />

      <div className="relative h-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all overflow-hidden">
        {/* Hover Overlay Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xl transform transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
            <Icon size={28} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors">
                {title}
              </h3>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <ArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </div>
            </div>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-base leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
