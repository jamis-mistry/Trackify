import React, { useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { ClipboardList } from "lucide-react";

const WorkerAssignments = () => {
    return (
        <DashboardLayout role="worker">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    My Assignments
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Manage your assigned complaints and tasks.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-4">
                    <ClipboardList className="text-indigo-500 dark:text-indigo-400" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No active assignments
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    You don't have any tasks assigned to you right now. Check back later or contact your organization admin.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default WorkerAssignments;
