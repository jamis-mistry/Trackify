import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ComplaintsList from "../../components/complaints/ComplaintsList";

const MyComplaints = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="user">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and track the status of your filed complaints.</p>
        </div>

        <button
          onClick={() => navigate('/user/create')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} />
          Submit Complaint
        </button>
      </div>

      <ComplaintsList />
    </DashboardLayout>
  );
};

export default MyComplaints;
