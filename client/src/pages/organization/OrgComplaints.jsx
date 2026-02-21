import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { AuthContext } from "../../context/AuthContext";
import { Search, Filter, AlertCircle, Clock, CheckCircle, BarChart2 } from "lucide-react";

const OrgComplaints = () => {
  const { user, getMockComplaints } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Use the new filters object for organization-wide complaints
        const data = await getMockComplaints({ organization: user?.organizationName });
        setComplaints(data || []);
      } catch (e) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const statusColor = (status) => {
    switch (status) {
      case "Open": return "yellow";
      case "In Progress": return "purple";
      case "Resolved": return "green";
      case "Rejected": return "red";
      default: return "gray";
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "Medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "Low": return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default: return "text-gray-500 bg-gray-50 dark:bg-gray-800";
    }
  };

  const filtered = complaints.filter(c => {
    const matchSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.user || c.userName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.id || c._id)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchPriority = filterPriority === "All" || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <DashboardLayout role={user?.role || "organization"}>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Complaints</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View complaints · track worker progress · get instant notifications
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, title, or user..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {["All", "Open", "In Progress", "Resolved", "Rejected"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {["All", "High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">Loading complaints...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">No complaints found.</td>
                </tr>
              ) : filtered.map(c => {
                const prog = c.progress ?? null;
                const lastNote = c.workLog?.slice(-1)[0];
                return (
                  <tr key={c.id || c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {(c.id || c._id)?.slice(0, 12)}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.title}</p>
                      {lastNote && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          Last note: "{lastNote.note}"
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityStyle(c.priority)}`}>
                        {c.priority || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge text={c.status} color={statusColor(c.status)} />
                    </td>
                    <td className="p-4 min-w-[130px]">
                      {prog !== null ? (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 dark:text-slate-400">Done</span>
                            <span className={`font-bold ${prog === 100 ? 'text-green-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
                              {prog}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${prog === 100 ? 'bg-green-400' : 'bg-indigo-500'}`}
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not started</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {c.assignedWorkerName || <span className="text-slate-300 dark:text-slate-600 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgComplaints;