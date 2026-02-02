import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/common/Badge";

const UserOrgComplaints = () => {
    // Temporary mock data (replace with API later - same as OrgComplaints for now)
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

    const statusColor = (status) => {
        switch (status) {
            case "Open":
                return "yellow";
            case "In Progress":
                return "purple";
            case "Resolved":
                return "green";
            case "Rejected":
                return "red";
            default:
                return "gray";
        }
    };

    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-purple-50">
            <Sidebar role="user" />

            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Organization Complaints</h1>
                    <button
                        onClick={() => navigate('/user/org-complaints/create')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        Add Complaint
                    </button>
                </div>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-purple-100">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Priority</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-3">{c.id}</td>
                                    <td className="p-3">{c.user}</td>
                                    <td className="p-3">{c.title}</td>
                                    <td className="p-3">{c.priority}</td>
                                    <td className="p-3">
                                        <Badge text={c.status} color={statusColor(c.status)} />
                                    </td>
                                    <td className="p-3">{c.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default UserOrgComplaints;
