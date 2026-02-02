import React, { useState } from "react";
import { Search, Filter, ChevronDown, MoreVertical } from "lucide-react";

const ComplaintsList = () => {
    // Mock Data
    const initialComplaints = [
        {
            id: "CMP-1001",
            subject: "Internet speed is very slow",
            category: "Technical",
            status: "Open",
            createdAt: "2026-01-24",
            priority: "High"
        },
        {
            id: "CMP-1002",
            subject: "Billing amount discrepancy",
            category: "Billing",
            status: "In Progress",
            createdAt: "2026-01-22",
            priority: "Medium"
        },
        {
            id: "CMP-1003",
            subject: "AC unit making loud noise",
            category: "Infrastructure",
            status: "Resolved",
            createdAt: "2026-01-20",
            priority: "Low"
        },
        {
            id: "CMP-1004",
            subject: "Login portal not accessible",
            category: "Technical",
            status: "Resolved",
            createdAt: "2026-01-18",
            priority: "High"
        },
        {
            id: "CMP-1005",
            subject: "Request for new parking sticker",
            category: "Admin",
            status: "Open",
            createdAt: "2026-01-25",
            priority: "Low"
        },
        {
            id: "CMP-1006",
            subject: "Water cooler leakage on 3rd floor",
            category: "Infrastructure",
            status: "In Progress",
            createdAt: "2026-01-26",
            priority: "Medium"
        }
    ];

    const [complaints, setComplaints] = useState(initialComplaints);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Filter Logic
    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || complaint.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Helper for Status Badge Styles
    const getStatusStyle = (status) => {
        switch (status) {
            case "Open":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
            case "Resolved":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            {/* Header: Title + Controls */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Complaints</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Filter size={16} />
                        </div>
                        <select
                            className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                            <th className="px-6 py-4 font-semibold">Complaint ID</th>
                            <th className="px-6 py-4 font-semibold">Subject</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Created Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint) => (
                                <tr
                                    key={complaint.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {complaint.id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                                        {complaint.subject}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {complaint.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(complaint.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${complaint.status === "Open" ? "bg-yellow-500" :
                                                    complaint.status === "In Progress" ? "bg-blue-500" : "bg-green-500"
                                                }`}></span>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                        {complaint.createdAt}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    No complaints found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination Placeholder */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Showing {filteredComplaints.length} of {complaints.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintsList;
