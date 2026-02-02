import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { Search, Filter, AlertCircle, Clock, CheckCircle, MoreHorizontal } from "lucide-react";

const OrgComplaints = () => {
  // Temporary mock data (replace with API later)
  const complaints = [
    {
      id: "CMP-301",
      user: "John Doe",
      title: "Email not syncing",
      priority: "Medium",
      status: "Open",
      createdAt: "2026-01-12",
    },
    {
      id: "CMP-302",
      user: "Jane Smith",
      title: "Printer not working",
      priority: "Low",
      status: "Resolved",
      createdAt: "2026-01-14",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const statusColor = (status) => {
    switch (status) {
      case "Open":
        return "yellow";
      case "In Progress":
        return "purple"; // Using purple as per previous, or orange usually
      case "Resolved":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "Medium":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "Low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="organization">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Complaints</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage complaints filed by your organization members.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search complaints by ID, title, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium">
            Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {c.id}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">{c.user}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{c.title}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColor(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge text={c.status} color={statusColor(c.status)} />
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {c.createdAt}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colspan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgComplaints;