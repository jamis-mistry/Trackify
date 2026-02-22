import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import {
    Users, Building2, Mail, BadgeCheck, Shield, Search,
    Trash2, Edit3, User, Briefcase, ChevronRight, X, Loader2
} from "lucide-react";

const AdminUsers = () => {
    const { getMockUsers, deleteUserAny } = useContext(AuthContext);
    const toast = useToast();
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    // Modals
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await getMockUsers();
            if (Array.isArray(allUsers)) {
                // Show all users except the current super admin (optional, but safer)
                setUsersList(allUsers);
            }
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = usersList.filter(user => {
        const matchesSearch =
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = filterRole === "all" || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUserAny(userToDelete._id || userToDelete.id);
            const targetId = userToDelete._id || userToDelete.id;
            setUsersList(usersList.filter(u => (u._id || u.id) !== targetId));
            toast.success("User deleted successfully");
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* Background FX */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                User Management
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 dark:text-lg">
                                Manage roles and permissions for {usersList.length} users
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
                                />
                            </div>

                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm font-semibold"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="worker">Workers</option>
                                <option value="organization">Organizations</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-500 animate-pulse">Fetching users...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <UserCard
                                            key={u._id || u.id}
                                            user={u}
                                            onDelete={() => handleDeleteClick(u)}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users size={32} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No matches found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                            We couldn't find any users matching your criteria. Try adjusting your filters.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Permanent Account Deletion"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Trash2 size={24} />
                        </div>
                        <p className="text-red-700 dark:text-red-400 font-medium">
                            Warning: This will permanently delete all data associated with this user.
                        </p>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 px-1">
                        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white underline decoration-red-500 underline-offset-4">{userToDelete?.name}</span>? This action is IRREVERSIBLE.
                    </p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-6 py-3 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-6 py-3 text-white font-bold bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-500/20 transition-all font-bold"
                        >
                            Delete Forever
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

const UserCard = ({ user, onDelete }) => {
    const roleColors = {
        admin: "from-pink-500 to-rose-600",
        organization: "from-purple-500 to-indigo-600",
        worker: "from-blue-500 to-cyan-600",
        user: "from-indigo-500 to-blue-600"
    };

    const RoleIcon = {
        admin: Shield,
        organization: Building2,
        worker: Briefcase,
        user: User
    }[user.role] || User;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
        >
            {/* Glossy Header */}
            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-br ${roleColors[user.role] || roleColors.user} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-4 group-hover:scale-110 transition-transform duration-500">
                    <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${roleColors[user.role] || roleColors.user} blur opacity-20 group-hover:opacity-40`} />
                    <div className="relative w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=200`}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-50 dark:border-slate-700 text-${user.role === 'admin' ? 'pink' : user.role === 'organization' ? 'purple' : 'blue'}-500 group-hover:rotate-12 transition-transform`}>
                        <RoleIcon size={16} />
                    </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {user.name}
                </h3>

                <div className="flex items-center gap-1.5 text-slate-400 mt-1 mb-6">
                    <Mail size={14} />
                    <span className="text-xs font-bold tracking-tight uppercase truncate max-w-[180px]">{user.email}</span>
                </div>

                <div className="w-full grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                        Profile <ChevronRight size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-600 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminUsers;
