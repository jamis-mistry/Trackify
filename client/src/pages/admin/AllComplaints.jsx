import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FileText, Building2, User, Clock, AlertCircle, CheckCircle, XCircle, Search, Filter } from "lucide-react";

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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const AllComplaints = () => {
  const navigate = useNavigate();
  const { getMockComplaints } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      const data = await getMockComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "All" || c.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout role="admin">
      <div className="relative min-h-[calc(100vh-100px)]">
        {/* Background FX - Red/Purple Theme for Complaints */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-red-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Complaint Log
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                Track and resolve {complaints.length} reported issues
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative sm:w-48">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Filter size={18} />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none cursor-pointer shadow-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} navigate={navigate} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
              >
                <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No complaints found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

const ComplaintCard = ({ complaint, navigate }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Open": return { color: "bg-yellow-50 text-yellow-700 border-yellow-100", icon: AlertCircle };
      case "In Progress": return { color: "bg-purple-50 text-purple-700 border-purple-100", icon: Clock };
      case "Resolved": return { color: "bg-green-50 text-green-700 border-green-100", icon: CheckCircle };
      case "Rejected": return { color: "bg-red-50 text-red-700 border-red-100", icon: XCircle };
      default: return { color: "bg-gray-50 text-gray-700 border-gray-100", icon: AlertCircle };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-orange-400 text-white';
      default: return 'bg-blue-400 text-white';
    }
  };

  const statusConfig = getStatusConfig(complaint.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform duration-500 group-hover:scale-110" />

      <div className="flex justify-between items-start mb-4 relative z-10 w-full">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getPriorityColor(complaint.priority)}`}>
          {complaint.priority} Priority
        </span>
        <span className="text-xs font-mono text-slate-400">#{complaint.id}</span>
      </div>

      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" title={complaint.title}>
          {complaint.title}
        </h3>
        {/* Replaced description placeholder with actual data if available, or just organization/user info */}
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
          <Building2 size={14} />
          <span className="truncate">{complaint.organization}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-4 border-t border-slate-100 dark:border-slate-700 mt-auto w-full">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <User size={14} className="text-slate-400" />
            {complaint.user}
          </div>
          <span className="text-xs text-slate-400">{complaint.createdAt}</span>
        </div>

        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${statusConfig.color} w-full justify-center`}>
          <StatusIcon size={16} />
          <span className="font-semibold text-sm">{complaint.status}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
        className="w-full mt-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-medium hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm group-hover:shadow-md"
      >
        View Details
      </button>
    </motion.div>
  );
};

export default AllComplaints;
