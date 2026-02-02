import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import { Users, Building2, Mail, BadgeCheck, Shield, Search, Trash2 } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const AdminUsers = () => {
    const { getMockUsers, deleteUserAny } = useContext(AuthContext);
    const toast = useToast();
    const [usersList, setUsersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await getMockUsers();
            if (Array.isArray(allUsers)) {
                const regularUsers = allUsers.filter(u => u.role === 'user');
                setUsersList(regularUsers);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = usersList.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.organizationName && user.organizationName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

                <div className="animate-fade-in-up">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                User Management
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                                View and manage {usersList.length} individual users
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <UserCard key={u._id || u.id} user={u} onDelete={() => handleDeleteClick(u)} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Users className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No users found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete User"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{userToDelete?.name}</span>?
                        <br />
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </Modal>

        </DashboardLayout >
    );
};

const UserCard = ({ user, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center"
    >
        <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 dark:opacity-20" />
        <div className="absolute top-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-lg mb-4 mt-6 group-hover:scale-105 transition-transform duration-300">
            <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=200`}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full" title="Active"></div>
        </div>

        <div className="relative z-10 w-full px-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {user.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mt-1 mb-6">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate max-w-[200px]" title={user.email}>{user.email}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 py-4 border-t border-slate-100 dark:border-slate-700 w-full">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Role</span>
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 capitalize">{user.role}</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Organization</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-full px-1" title={user.organizationName || "None"}>
                        {user.organizationName || "None"}
                    </span>
                </div>
            </div>

            <button className="w-full mt-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 text-sm">
                View Profile
            </button>
            <button
                onClick={onDelete}
                className="w-full mt-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-600 hover:text-white transition-all duration-300 text-sm flex items-center justify-center gap-2"
            >
                <Trash2 size={16} /> Delete User
            </button>
        </div>
    </motion.div>
);

export default AdminUsers;
