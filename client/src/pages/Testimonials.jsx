import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/AuthContext";
import {
    Star, Quote, Loader2, MessageSquareQuote,
    Send, CheckCircle2, XCircle, ChevronDown,
    LogIn, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import testimonialService from "../services/testimonialService";

/* ─── Star Rating picker ─────────────────────────────────────── */
const StarPicker = ({ value, onChange }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="transition-transform hover:scale-125 focus:outline-none"
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
                <Star
                    size={28}
                    className={
                        star <= value
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                            : "text-gray-300 dark:text-gray-600"
                    }
                />
            </button>
        ))}
    </div>
);

/* ─── Single testimonial card ─────────────────────────────────── */
const TestimonialCard = ({ t, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4 }}
        className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 relative hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
        <Quote className="absolute top-6 right-6 text-indigo-200 dark:text-indigo-900/30" size={48} />

        <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={18}
                    className={i <= t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}
                />
            ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed relative z-10 flex-1">
            &ldquo;{t.content}&rdquo;
        </p>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {t.role}, {t.company}
            </p>
        </div>
    </motion.div>
);

/* ─── Main page ───────────────────────────────────────────────── */
const Testimonials = () => {
    const { user, isAuthenticated } = useContext(AuthContext);

    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    /* form state */
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMsg, setErrorMsg] = useState("");
    const [form, setForm] = useState({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
    });

    /* Pre-fill name from logged-in user */
    useEffect(() => {
        if (user?.name) {
            setForm((prev) => ({ ...prev, name: user.name }));
        }
    }, [user]);

    const fetchTestimonials = async () => {
        setLoading(true);
        const data = await testimonialService.getTestimonials();
        setTestimonials(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.role.trim() || !form.company.trim() || !form.content.trim()) {
            setErrorMsg("Please fill in all required fields.");
            setSubmitStatus("error");
            return;
        }
        setSubmitting(true);
        setSubmitStatus(null);
        setErrorMsg("");

        const result = await testimonialService.createTestimonial(form);

        if (result.success) {
            setSubmitStatus("success");
            setForm({ name: user?.name || "", role: "", company: "", content: "", rating: 5 });
            await fetchTestimonials();
            setTimeout(() => {
                setShowForm(false);
                setSubmitStatus(null);
            }, 3000);
        } else {
            setErrorMsg(result.error || "Something went wrong. Please try again.");
            setSubmitStatus("error");
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            <PublicHeader />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">

                    {/* ── Hero header ── */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
                        >
                            Loved by Teams Everywhere
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
                        >
                            Don&apos;t just take our word for it. See what our users have to say about Trackify.
                        </motion.p>

                        {/* CTA button — changes based on auth state */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            {isAuthenticated ? (
                                /* Logged-in → toggle form */
                                <button
                                    onClick={() => { setShowForm((v) => !v); setSubmitStatus(null); }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    <MessageSquareQuote size={20} />
                                    {showForm ? "Close Form" : "Share Your Experience"}
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${showForm ? "rotate-180" : ""}`}
                                    />
                                </button>
                            ) : (
                                /* Guest → login prompt pill */
                                <div className="inline-flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                                        <Lock size={15} className="text-gray-400" />
                                        <span>You must be logged in to share a testimonial</span>
                                    </div>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <LogIn size={20} />
                                        Login to Share Your Experience
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* ── Submission Form (only for authenticated users) ── */}
                    <AnimatePresence>
                        {isAuthenticated && showForm && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: "auto", marginBottom: 56 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-900 rounded-3xl border border-indigo-100 dark:border-gray-800 p-8 shadow-lg">

                                    {/* Form header */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                                            <MessageSquareQuote size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                                Leave a Testimonial
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Sharing as &nbsp;
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {user?.name}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status banners */}
                                    <AnimatePresence>
                                        {submitStatus === "success" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl mb-5 font-semibold text-sm"
                                            >
                                                <CheckCircle2 size={20} />
                                                Thank you! Your testimonial has been published and is now visible to everyone.
                                            </motion.div>
                                        )}
                                        {submitStatus === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-5 font-semibold text-sm"
                                            >
                                                <XCircle size={20} />
                                                {errorMsg}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name + Role row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                    placeholder="e.g. Sarah Johnson"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition-all font-medium text-sm shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                                    Role / Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.role}
                                                    onChange={(e) => handleChange("role", e.target.value)}
                                                    placeholder="e.g. HR Manager"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition-all font-medium text-sm shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                                Company / Organization *
                                            </label>
                                            <input
                                                type="text"
                                                value={form.company}
                                                onChange={(e) => handleChange("company", e.target.value)}
                                                placeholder="e.g. TechFlow Inc."
                                                className="w-full px-4 py-3 rounded-xl border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition-all font-medium text-sm shadow-sm"
                                            />
                                        </div>

                                        {/* Testimonial content */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                                                Your Testimonial *
                                            </label>
                                            <textarea
                                                value={form.content}
                                                onChange={(e) => handleChange("content", e.target.value)}
                                                placeholder="Share your experience with Trackify..."
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none shadow-sm"
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                                Your Rating
                                            </label>
                                            <StarPicker value={form.rating} onChange={(v) => handleChange("rating", v)} />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 mt-2"
                                        >
                                            {submitting ? (
                                                <><Loader2 className="animate-spin" size={20} /> Submitting...</>
                                            ) : (
                                                <><Send size={18} /> Submit Testimonial</>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Testimonials grid ── */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                            <Loader2 className="animate-spin mb-4" size={48} />
                            <p className="text-lg font-medium">Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                            <MessageSquareQuote size={64} className="mb-6 opacity-30" />
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                No testimonials yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                                Be the first to share your experience with Trackify!
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8 font-medium">
                                {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} from our community
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {testimonials.map((t, idx) => (
                                        <TestimonialCard key={t._id} t={t} index={idx} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Testimonials;
