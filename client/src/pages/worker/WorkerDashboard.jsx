import React, { useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import MetricCard from "../../components/dashboard/MetricCard";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const WorkerDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <DashboardLayout role="worker">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Hello, {user?.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Here are your assigned tasks for today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    title="Pending Tasks"
                    value="5"
                    icon={Clock}
                    color="blue"
                    trend="+2 new"
                />
                <MetricCard
                    title="Completed Today"
                    value="12"
                    icon={CheckCircle}
                    color="green"
                    trend="Top 10%"
                />
                <MetricCard
                    title="High Priority"
                    value="2"
                    icon={AlertCircle}
                    color="red"
                    trend="Urgent"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Assignments</h3>
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    <p>Assignment list implementation coming soon...</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WorkerDashboard;
