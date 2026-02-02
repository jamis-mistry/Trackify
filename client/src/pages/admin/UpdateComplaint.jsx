import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const UpdateComplaint = () => {
  const { id } = useParams();

  // Temporary mock data (replace with API later)
  const complaint = {
    id,
    title: "Server downtime",
    user: "John Doe",
    organization: "ABC Corp",
    priority: "High",
    status: "Open",
    description:
      "The main server has been down since morning causing service disruption.",
  };

  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

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

  const handleUpdate = (e) => {
    e.preventDefault();

    // Later: API call
    setMessage("Complaint status updated successfully!");
  };

  return (
    <div className="flex min-h-screen bg-purple-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Update Complaint</h1>

        <div className="bg-white p-6 rounded shadow max-w-2xl">
          <div className="mb-4">
            <p className="text-gray-600">Complaint ID</p>
            <p className="font-semibold">{complaint.id}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Title</p>
            <p>{complaint.title}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">User</p>
            <p>{complaint.user}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Organization</p>
            <p>{complaint.organization}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Priority</p>
            <p>{complaint.priority}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Current Status</p>
            <Badge text={status} color={statusColor(status)} />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-purple-400"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Admin Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-purple-400"
              rows="3"
            />
          </div>

          {message && (
            <p className="mb-4 text-sm text-green-600">{message}</p>
          )}

          <Button onClick={handleUpdate}>Update Status</Button>
        </div>
      </main>
    </div>
  );
};

export default UpdateComplaint;
