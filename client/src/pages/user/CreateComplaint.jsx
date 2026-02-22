import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { FileText, Send, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const CreateComplaint = () => {
  const { user, createComplaint, categories } = useContext(AuthContext);

  const issueCategories = categories
    .filter(c => c.type === 'issue')
    .map(c => c.name);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(issueCategories[0] || "Technical");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (!user?.organizationName && user?.role !== 'admin') { // Relaxed check for testing if orgId missing in mock
    return (
      <DashboardLayout role="user">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-lg">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-slate-900">Access Restricted</h1>
            <p className="text-slate-600">
              You are not currently associated with an active organization.
              Please contact your administrator.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (description.length < 10) {
      setMessage("Description must be at least 10 characters");
      setIsSubmitting(false);
      return;
    }

    // Create complaint via Context
    const complaintData = {
      title,
      category,
      description,
      priority,
      user: user.name,
      userId: user._id || user.id,
      organization: user.organizationName,
      organizationId: user.organizationId
    };

    try {
      await createComplaint(complaintData, attachments);
      setMessage("Complaint submitted successfully with attachments!");
      // Reset form
      setTitle("");
      setCategory("Technical");
      setDescription("");
      setPriority("Low");
      setAttachments([]);
    } catch (err) {
      setMessage("Failed to submit complaint. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="relative min-h-[calc(100vh-100px)]">
        {/* Background FX */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <FileText size={32} />
              </div>
              Submit New Complaint
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
              Describe your issue clearly for faster resolution
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                {message.includes("success") ? <Send size={18} /> : <AlertCircle size={18} />}
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Issue Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the problem"
                className="bg-slate-50 dark:bg-slate-700/50"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  >
                    {issueCategories.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all min-h-[150px]"
                  placeholder="Please provide specific details including timestamps, error messages, and steps to reproduce..."
                />
                <p className="text-right text-xs text-slate-400 mt-1">{description.length} chars (min 10)</p>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <label className="block text-slate-700 dark:text-slate-200 font-semibold">Attachments (Photos/Videos)</label>
                <div className="flex flex-wrap gap-4">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="relative group w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
                      {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px] font-bold">VIDEO</div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <AlertCircle size={14} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                    <Send size={20} className="text-slate-400 rotate-[-45deg]" />
                    <span className="text-[10px] text-slate-500 font-bold mt-2">UPLOAD</span>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
                  </label>
                </div>
                <p className="text-xs text-slate-400 italic">Supported formats: JPG, PNG, MP4, MOV. Max size 50MB.</p>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full py-4 text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30">
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CreateComplaint;

