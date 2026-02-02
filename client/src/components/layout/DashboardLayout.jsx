import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children, role = "user" }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-transparent font-sans text-gray-900 dark:text-white transition-colors duration-300">
            {/* Fixed Sidebar */}
            <Sidebar
                role={role}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Area */}
            <div
                className={`flex-1 relative flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "ml-20" : "ml-72"
                    }`}
            >
                <Header />

                <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
