import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Bell, Search, ChevronDown, LogOut, User, Settings, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fallback if no user is logged in (though typically protected route handles this)
    const userName = user?.name || "Naivedh";
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <header className="h-20 bg-white dark:bg-gray-900 sticky top-0 z-20 px-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                    Hello, <span className="font-bold text-gray-900 dark:text-white">{userName}</span>
                </h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Bar - hidden on mobile */}
                <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full ml-2 placeholder-gray-400"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    <button className="relative p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800">
                        <Bell size={22} />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700"></div>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all overflow-hidden">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userInitial
                                )}
                            </div>
                            <div className="hidden md:block text-left mr-2">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{userName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'}</p>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 md:hidden">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{userName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'User'}</p>
                                </div>
                                <Link to="/user/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                    <User size={16} className="text-gray-400" />
                                    Profile
                                </Link>

                                <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
