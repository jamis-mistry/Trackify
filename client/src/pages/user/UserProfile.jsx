import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { User, Mail, Shield, Building2, Calendar, Fingerprint, Camera, Save, X, History, Tag } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Reset form when user changes or edit mode closes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            });
            setPreviewImage(user.profilePicture || null);
        }
    }, [user, isEditing]);

    if (!user) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                alert("File size is too large. Please select an image under 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserProfile({
                name: formData.name,
                // Email updates might require re-login in real apps, but ok for mock
                email: formData.email,
                profilePicture: previewImage
            });
            setIsEditing(false);
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user.role || 'user'}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-visible relative">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative rounded-t-xl">
                        <div className="absolute -bottom-12 left-8 group">
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center shadow-md overflow-hidden relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                                        <Camera className="text-white" size={24} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-colors"
                                        title="Cancel"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <Save size={16} />
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        {!isEditing ? (
                            // View Mode
                            <>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 capitalize">
                                        {user.role}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <ProfileSection title="Personal Information">
                                        <ProfileItem icon={User} label="Full Name" value={user.name} />
                                        <ProfileItem icon={Mail} label="Email Address" value={user.email} />
                                        <ProfileItem icon={Calendar} label="Member Since" value={new Date(user.id).toLocaleDateString()} />
                                    </ProfileSection>

                                    <ProfileSection title="Account Details">
                                        <ProfileItem icon={Shield} label="Role" value={user.role} capitalize />
                                        <ProfileItem icon={Building2} label="Organization" value={user.organizationName || "N/A"} />
                                        <ProfileItem icon={Fingerprint} label="User ID" value={`#${user.id}`} />
                                        {user.role === 'worker' && user.workerCategories?.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-400 shadow-sm">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">My Categories</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {user.workerCategories.map(cat => (
                                                            <span key={cat} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </ProfileSection>
                                </div>

                                {/* Work History Link — workers only */}
                                {user.role === 'worker' && (
                                    <div className="mt-6">
                                        <Link
                                            to="/worker/history"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                                        >
                                            <History size={16} />
                                            View Work History
                                        </Link>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Edit Mode
                            <div className="mt-2 animate-in fade-in duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Edit Information</h3>
                                        <Input
                                            label="Full Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <Input
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            type="email"
                                        />
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Shield size={16} />
                                            ReadOnly Fields
                                        </h4>
                                        <p>Some information like your <strong>Role</strong> and <strong>Organization</strong> cannot be changed directly.</p>
                                        <p className="mt-2">If you need to update these, please contact your Organization Admin.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const ProfileSection = ({ title, children }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ProfileItem = ({ icon: Icon, label, value, capitalize }) => (
    <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-400 shadow-sm">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-sm font-medium text-gray-900 dark:text-white mt-0.5 ${capitalize ? 'capitalize' : ''}`}>
                {value}
            </p>
        </div>
    </div>
);

export default UserProfile;
