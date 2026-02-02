import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  History,
  User,
  Users,
  Building2,
  Briefcase,
  Menu
} from "lucide-react";


const Sidebar = ({ role, isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Sidebar links based on role
  const links = {
    user: [
      { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
      { name: "My Complaints", path: "/user/complaints", icon: FileText },
      { name: "History", path: "/user/history", icon: History },
      { name: "Profile", path: "/user/profile", icon: User },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Organizations", path: "/admin/organizations", icon: Building2 },
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "All Complaints", path: "/admin/complaints", icon: FileText },
    ],
    organization: [
      { name: "Dashboard", path: "/organization/dashboard", icon: LayoutDashboard },
      { name: "Manage Users", path: "/organization/users", icon: Users },
      { name: "All Complaints", path: "/organization/complaints", icon: Building2 },
    ],
    worker: [
      { name: "Dashboard", path: "/worker/dashboard", icon: LayoutDashboard },
      { name: "My Assignments", path: "/worker/assignments", icon: Briefcase },
      { name: "Profile", path: "/user/profile", icon: User },
    ],
  };

  const sidebarVariants = {
    expanded: { width: 288 },
    collapsed: { width: 80 }
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800 min-h-screen flex flex-col fixed left-0 top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className={`h-20 flex items-center px-4 ${isCollapsed ? "justify-center" : "gap-4"}`}>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
        >
          <Menu size={24} />
        </button>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            >
              <Link to="/" className="flex items-center gap-3">
                <img src="/trackify-logo.png" alt="Trackify" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  Trackify
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-hidden">
        <ul className="space-y-1.5">
          {links[role]?.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="relative flex items-center group"
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <div className={`
                    relative z-10 flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200
                    ${active ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"}
                    ${isCollapsed ? "justify-center" : "gap-3"}
                  `}>
                    <Icon
                      size={24}
                      className={`flex-shrink-0 transition-colors duration-200 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        }`}
                    />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {link.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


    </motion.aside>
  );
};

export default Sidebar;
