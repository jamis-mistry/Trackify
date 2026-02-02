import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/common/Badge";

const ComplaintDetail = () => {
  const { id } = useParams();

  // Temporary mock data (replace with API later)
  const complaint = {
    id,
    title: "Internet not working",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    description:
      "The internet connection has been down since yesterday evening and is affecting work.",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-16",
  };

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

  return (
    <div className="flex min-h-screen bg-purple-50">
      <Sidebar role="user" />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Complaint Details</h1>

        <div className="bg-white p-6 rounded shadow max-w-2xl">
          <div className="mb-4">
            <p className="text-gray-600">Complaint ID</p>
            <p className="font-semibold">{complaint.id}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Title</p>
            <p className="font-semibold">{complaint.title}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Category</p>
            <p>{complaint.category}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Priority</p>
            <p>{complaint.priority}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Status</p>
            <Badge
              text={complaint.status}
              color={statusColor(complaint.status)}
            />
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Description</p>
            <p className="mt-1">{complaint.description}</p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Created on: {complaint.createdAt}</p>
            <p>Last updated: {complaint.updatedAt}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
