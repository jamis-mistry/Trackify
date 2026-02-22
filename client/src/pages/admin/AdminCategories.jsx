import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Tag, Briefcase, FileWarning, Loader2, Search } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const AdminCategories = () => {
    const { categories, addCategory, deleteCategory, fetchCategories } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "worker");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newCatType, setNewCatType] = useState(activeTab);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && (tab === "worker" || tab === "issue")) {
            setActiveTab(tab);
            setNewCatType(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
        setActiveTab(tab);
        setNewCatType(tab);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        setLoading(true);
        try {
            await addCategory({ name: newCatName, type: newCatType });
            setNewCatName("");
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Add category error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error("Delete category error", error);
            }
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.type === activeTab &&
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <div className="relative min-h-[calc(100vh-100px)]">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Category Management
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure service and issue classifications</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-center bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-[1.5rem] w-full md:w-auto">
                        <button
                            onClick={() => handleTabChange("worker")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "worker"
                                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                }`}
                        >
                            <Briefcase size={18} />
                            Worker Categories
                        </button>
                        <button
                            onClick={() => handleTabChange("issue")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "issue"
                                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                                }`}
                        >
                            <FileWarning size={18} />
                            Issue Categories
                        </button>
                    </div>

                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab} categories...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={cat.id}
                                    className="group relative bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'worker' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'}`}>
                                                {activeTab === 'worker' ? <Briefcase size={22} /> : <FileWarning size={22} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.name}</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{activeTab} type</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                <Tag size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No categories found</h3>
                                <p className="text-slate-500 max-w-xs">There are no {activeTab} categories matching your search criteria.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Category Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-white/20"
                        >
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">New Category</h2>
                            <form onSubmit={handleAddCategory} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 ml-1">Type of Category</label>
                                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setNewCatType("worker")}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${newCatType === "worker"
                                                ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <Briefcase size={16} /> Worker
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewCatType("issue")}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${newCatType === "issue"
                                                ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <FileWarning size={16} /> Issue
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Category Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="e.g. Plumbing"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !newCatName.trim()}
                                        className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                        Create Category
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

export default AdminCategories;
