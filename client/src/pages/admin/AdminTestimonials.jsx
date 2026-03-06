import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquareQuote, Plus, Trash2, Search, Loader2,
    Star, CheckCircle2, XCircle, Eye, EyeOff
} from "lucide-react";
import testimonialService from "../../services/testimonialService";

const STAR_COUNT = 5;

const StarRating = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[...Array(STAR_COUNT)].map((_, i) => (
            <button
                key={i}
                type="button"
                onClick={() => onChange && onChange(i + 1)}
                className={`transition-transform hover:scale-125 focus:outline-none ${onChange ? "cursor-pointer" : "cursor-default"}`}
            >
                <Star
                    size={22}
                    className={i < value ? "text-yellow-400 fill-yellow-400" : "text-slate-300 dark:text-slate-600"}
                />
            </button>
        ))}
    </div>
);

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
    });

    const fetchAll = async () => {
        setLoading(true);
        const data = await testimonialService.getAllTestimonialsAdmin();
        setTestimonials(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({ name: "", role: "", company: "", content: "", rating: 5 });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.role.trim() || !form.company.trim() || !form.content.trim()) {
            setError("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        setError("");
        const result = await testimonialService.createTestimonial(form);
        if (result.success) {
            setSuccessMsg("Testimonial added successfully!");
            setIsModalOpen(false);
            resetForm();
            fetchAll();
            setTimeout(() => setSuccessMsg(""), 3000);
        } else {
            setError(result.error || "Failed to add testimonial.");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this testimonial? This cannot be undone.")) return;
        await testimonialService.deleteTestimonial(id);
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
    };

    const handleToggleApproval = async (id) => {
        const result = await testimonialService.toggleApproval(id);
        if (result.success) {
            setTestimonials((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isApproved: result.data.isApproved } : t))
            );
        }
    };

    const filtered = testimonials.filter((t) =>
        [t.name, t.role, t.company, t.content].some((field) =>
            (field || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <DashboardLayout role="admin">
            <div className="relative min-h-[calc(100vh-100px)]">

                {/* Success Toast */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 right-6 z-[100] bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-semibold"
                        >
                            <CheckCircle2 size={20} />
                            {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <MessageSquareQuote className="text-indigo-500" size={36} />
                            Testimonials
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
                            Manage user feedback shown on the public testimonials page
                        </p>
                    </div>

                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        Add Testimonial
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 mb-10 flex items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, role, company or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-semibold text-base placeholder:text-slate-400 outline-none"
                        />
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex gap-4 mb-8 flex-wrap">
                    {[
                        { label: "Total", value: testimonials.length, color: "from-indigo-500 to-purple-600" },
                        { label: "Published", value: testimonials.filter(t => t.isApproved).length, color: "from-emerald-500 to-teal-500" },
                        { label: "Hidden", value: testimonials.filter(t => !t.isApproved).length, color: "from-amber-500 to-orange-500" },
                    ].map((stat) => (
                        <div key={stat.label} className={`bg-gradient-to-r ${stat.color} text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-md`}>
                            <span className="text-2xl font-black">{stat.value}</span>
                            <span className="text-sm font-semibold opacity-90">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="text-lg font-medium">Loading testimonials...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                filtered.map((t) => (
                                    <motion.div
                                        layout
                                        key={t._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`group relative bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border transition-all duration-300 hover:shadow-xl overflow-hidden
                      ${t.isApproved
                                                ? "border-slate-100 dark:border-slate-700 hover:border-indigo-300/50"
                                                : "border-amber-200 dark:border-amber-700/40 bg-amber-50/30 dark:bg-amber-900/10"
                                            }`}
                                    >
                                        {/* Approval Badge */}
                                        <div className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full
                      ${t.isApproved
                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                            }`}>
                                            {t.isApproved ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {t.isApproved ? "Published" : "Hidden"}
                                        </div>

                                        {/* Stars */}
                                        <div className="mb-3 mt-1">
                                            <StarRating value={t.rating} />
                                        </div>

                                        {/* Content */}
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 italic line-clamp-4">
                                            &ldquo;{t.content}&rdquo;
                                        </p>

                                        {/* Author */}
                                        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{t.name}</h4>
                                            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">
                                                {t.role} · {t.company}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-1">
                                                Added {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => handleToggleApproval(t._id)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition-all
                          ${t.isApproved
                                                        ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100"
                                                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100"
                                                    }`}
                                            >
                                                {t.isApproved ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Publish</>}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-all"
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 bg-white/50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
                                        <MessageSquareQuote size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No testimonials yet</h3>
                                    <p className="text-slate-500 font-medium max-w-sm">
                                        Add your first testimonial to start populating the public testimonials page.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add Testimonial Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-3xl border border-white/20 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                    <MessageSquareQuote size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add Testimonial</h2>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold"
                                >
                                    <XCircle size={18} /> {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name *</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => handleFormChange("name", e.target.value)}
                                        placeholder="e.g. Sarah Johnson"
                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role / Designation *</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => handleFormChange("role", e.target.value)}
                                        placeholder="e.g. HR Manager"
                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                    />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Company / Organization *</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={(e) => handleFormChange("company", e.target.value)}
                                        placeholder="e.g. TechFlow Inc."
                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-semibold"
                                    />
                                </div>

                                {/* Testimonial Content */}
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Testimonial *</label>
                                    <textarea
                                        value={form.content}
                                        onChange={(e) => handleFormChange("content", e.target.value)}
                                        placeholder="What did this person say about Trackify?"
                                        rows={4}
                                        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                    />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rating</label>
                                    <StarRating value={form.rating} onChange={(val) => handleFormChange("rating", val)} />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <><Loader2 className="animate-spin" size={20} /> Saving...</>
                                        ) : (
                                            <><CheckCircle2 size={20} /> Add Testimonial</>
                                        )}
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

export default AdminTestimonials;
