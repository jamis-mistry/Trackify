import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import { Building2, User, Mail, Calendar, Search, Globe, Trash2 } from "lucide-react";

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

const AdminOrganizations = () => {
    const { getMockUsers, deleteUserAny } = useContext(AuthContext);
    const toast = useToast();
    const [orgsList, setOrgsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orgToDelete, setOrgToDelete] = useState(null);

    useEffect(() => {
        const fetchOrgs = async () => {
            const allUsers = await getMockUsers();
            if (Array.isArray(allUsers)) {
                const organizations = allUsers.filter(u => u.role === 'organization');
                setOrgsList(organizations);
            }
        };

        fetchOrgs();
    }, []);

    const filteredOrgs = orgsList.filter(org =>
        (org.organizationName && org.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (org) => {
        setOrgToDelete(org);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!orgToDelete) return;
        try {
            await deleteUserAny(org._id || org.id);
            setOrgsList(orgsList.filter(o => o.id !== orgToDelete.id && o._id !== orgToDelete._id));
            toast.success("Organization deleted successfully");
            setDeleteModalOpen(false);
            setOrgToDelete(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* Background FX - Blue/Cyan Theme */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                                Organization Directory
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                                Manage {orgsList.length} registered organizations
                            </p>
                        </div>

                        <div className="relative w-full md:w-72">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search organizations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrgs.length > 0 ? (
                            filteredOrgs.map((org) => (
                                <OrgCard key={org._id || org.id} org={org} onDelete={() => handleDeleteClick(org)} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
                            >
                                <Building2 className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No organizations found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>


            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Organization"
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{orgToDelete?.organizationName}</span>?
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
                            Delete Organization
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout >
    );
};

const OrgCard = ({ org, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center"
    >
        <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" />

        <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-sm mb-3 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <Building2 size={32} />
            </div>
        </div>

        <div className="relative z-10 w-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {org.organizationName || org.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    <Globe size={10} />
                    ID: {(org._id || org.id || "").toString().slice(0, 8)}...
                </span>
            </div>

            <div className="flex flex-col gap-3 py-4 border-t border-slate-100 dark:border-slate-700 w-full text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 shrink-0">
                        <User size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Admin</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{org.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 shrink-0">
                        <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate" title={org.email}>{org.email}</p>
                    </div>
                </div>
            </div>

            <div className="w-full pt-3 mt-auto border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(org.createdAt || parseInt(org._id || org.id || Date.now())).toLocaleDateString()}
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">Active</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Organization"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </motion.div>
);

export default AdminOrganizations;
