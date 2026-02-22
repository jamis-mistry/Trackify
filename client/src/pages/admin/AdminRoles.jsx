import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Trash2, Search, Loader2, Info } from "lucide-react";

const AdminRoles = () => {
    const { roles, addRole, deleteRole, fetchRoles } = useContext(AuthContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) return;

        setLoading(true);
        try {
            await addRole({ name: newRoleName, description: newRoleDesc });
            setNewRoleName("");
            setNewRoleDesc("");
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Add role error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (id) => {
        if (window.confirm("Are you sure you want to delete this system role? This may affect users currently assigned this role.")) {
            try {
                await deleteRole(id);
            } catch (error) {
                console.error("Delete role error", error);
            }
        }
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Role Management
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Define platform-wide user permissions and groups</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        New System Role
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 mb-10 flex items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search existing roles by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-semibold text-lg placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={role.id}
                                    className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Decorative background icon */}
                                    <Shield size={120} className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-900 opacity-50 group-hover:rotate-12 transition-transform duration-700" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                                <Shield size={28} />
                                            </div>
                                            <button
                                                onClick={() => handleDeleteRole(role.id)}
                                                className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors capitalize">{role.name}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                            {role.description || "No description provided for this system role."}
                                        </p>

                                        <div className="pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
                                                ID: {role.id}
                                            </span>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700" />
                                                ))}
                                                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">+12</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 bg-white/50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                                    <Shield size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No roles found</h3>
                                <p className="text-slate-500 font-medium max-w-sm">No system roles match your search. Create persistent roles to manage user categories.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Role Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-3xl border border-white/20"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Add System Role</h2>
                            </div>

                            <form onSubmit={handleAddRole} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Role Identifier</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-purple-500 outline-none transition-all font-bold text-lg"
                                        placeholder="e.g. Moderator"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
                                    <textarea
                                        value={newRoleDesc}
                                        onChange={(e) => setNewRoleDesc(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-purple-500 outline-none transition-all font-medium min-h-[120px] resize-none"
                                        placeholder="What permissions does this role include?"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !newRoleName.trim()}
                                        className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={24} /> : <BadgeCheck size={24} />}
                                        Activate Role
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

// Helper icon
const BadgeCheck = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default AdminRoles;
