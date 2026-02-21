import React, { useState, useEffect, useContext } from "react";
import { Search, Filter, ChevronDown, MoreVertical, Paperclip, Image as ImageIcon, Video, Eye } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const ComplaintsList = () => {
    const { user, getMockComplaints } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const [viewMode, setViewMode] = useState("organization"); // "my" or "organization"

    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true);
            const filters = {};
            if (viewMode === "my") {
                filters.userId = user?._id || user?.id;
            } else if (user?.organizationName) {
                filters.organization = user.organizationName;
            }
            const data = await getMockComplaints(filters);
            setComplaints(data);
            setLoading(false);
        };
        fetchComplaints();
    }, [user, getMockComplaints, viewMode]);

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
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {viewMode === "my" ? "My Complaints" : "Organization Complaints"}
                    </h2>
                    {user?.organizationName && (
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mt-2">
                            <button
                                onClick={() => setViewMode("my")}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === "my" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                My Only
                            </button>
                            <button
                                onClick={() => setViewMode("organization")}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === "organization" ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                All Org
                            </button>
                        </div>
                    )}
                </div>

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
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Attachments</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Created Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        Fetching records...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint) => (
                                <tr
                                    key={complaint._id || complaint.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {complaint._id || complaint.id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                                        {complaint.title || complaint.subject}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {complaint.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {complaint.attachments && complaint.attachments.length > 0 ? (
                                                <button
                                                    onClick={() => window.open(`http://localhost:5000${complaint.attachments[0].url}`, '_blank')}
                                                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    {complaint.attachments[0].type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
                                                    <span>{complaint.attachments.length} {complaint.attachments.length === 1 ? 'file' : 'files'}</span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </div>
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
                                        {new Date(complaint.createdAt).toLocaleDateString()}
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
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
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
