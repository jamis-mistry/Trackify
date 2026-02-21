import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { UserPlus, Search, MoreVertical, Mail, Shield, User, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";

const ManageUsers = () => {
  const {
    addUserToOrg,
    getOrgUsers,
    deleteUserFromOrg,
    user,
    getMockComplaints,
    assignTaskToWorker,
    findUserByEmail
  } = useContext(AuthContext);

  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Load users from "Mock DB"
    const loadUsers = async () => {
      try {
        const orgUsers = await getOrgUsers();
        setUsers(Array.isArray(orgUsers) ? orgUsers : []);
      } catch (e) {
        console.error("Load users failed", e);
      }
    };

    loadUsers();
  }, [user]); // Refresh when user changes

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null); // { _id, name }
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchUser = (e) => {
    e.preventDefault();
    setError("");
    if (!searchEmail) return;

    const result = findUserByEmail(searchEmail);
    setFoundUser(result || null);
    setHasSearched(true);

    if (result) {
      // Check if already in this org
      if (result.organizationName === user?.organizationName || result.orgName === user?.organizationName) {
        setError("This user is already a member of your organization.");
        setFoundUser(null);
        return;
      }

      setFormData({
        name: result.name,
        email: result.email,
        role: "user"
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Pass only email (and optionally name/role) to context
      await addUserToOrg({ email: formData.email, name: formData.name, role: formData.role });
      toast.success("User added successfully!");

      // Update local list correctly
      const updated = await getOrgUsers();
      setUsers(updated);

      setFormData({ name: "", email: "", role: "user" });
      setSearchEmail("");
      setFoundUser(null);
      setHasSearched(false);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" }
          : u
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserFromOrg(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete && u._id !== userToDelete));
      toast.success("User deleted successfully");
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openAssignModal = async (worker) => {
    setAssignTarget(worker);
    setAssignMsg("");
    setSelectedComplaint("");
    try {
      const data = await getMockComplaints();
      // show only unresolved complaints in this org
      const orgComplaints = (data || []).filter(
        c => (c.organization === user?.organizationName || !c.organization) && c.status !== "Resolved"
      );
      setComplaints(orgComplaints);
    } catch (e) {
      setComplaints([]);
    }
    setAssignModalOpen(true);
  };

  const handleAssignTask = async () => {
    if (!selectedComplaint || !assignTarget) return;
    setAssigning(true);
    setAssignMsg("");
    try {
      await assignTaskToWorker(selectedComplaint, assignTarget._id || assignTarget.id, assignTarget.name);
      toast.success(`Task assigned to ${assignTarget.name}!`);
      setAssignMsg("Task assigned successfully!");
      setTimeout(() => { setAssignModalOpen(false); setAssignMsg(""); }, 1500);
    } catch (e) {
      setAssignMsg("Error: " + e.message);
    } finally {
      setAssigning(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="organization">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add and manage members of your organization.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          {showForm ? <XCircle size={18} /> : <UserPlus size={18} />}
          {showForm ? "Cancel" : "Add User"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add User</h2>
            <button onClick={() => { setShowForm(false); setHasSearched(false); setFoundUser(null); }} className="text-gray-400 hover:text-gray-500">
              <XCircle size={20} />
            </button>
          </div>

          <form onSubmit={handleSearchUser} className="mb-8">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Search user by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="outline" className="h-[46px]">
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>
          </form>

          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm font-medium">
                  <XCircle size={18} />
                  {error}
                </div>
              )}

              {foundUser ? (
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{foundUser.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{foundUser.email}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                        Found User
                      </span>
                    </div>
                  </div>
                </div>
              ) : !error ? (
                <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 mb-6 font-medium text-gray-500 dark:text-gray-400">
                  No user found with that email.
                </div>
              ) : null}

              {foundUser && (
                <form onSubmit={handleAddUser} className="max-w-2xl bg-gray-50/50 dark:bg-gray-800/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300">Select Role for {foundUser.name}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["user", "worker", "admin"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: r })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-bold capitalize transition-all ${formData.role === r
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:border-gray-200"
                            }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={() => { setHasSearched(false); setFoundUser(null); }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add to Organization
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {u.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                      }`}>
                      {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${u.status === 'Active' || !u.status
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                      {(u.status === 'Active' || !u.status) ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{u.createdAt || "Just now"}</td>
                  <td className="p-4 text-right">
                    {u.role === 'worker' && (
                      <button
                        onClick={() => openAssignModal(u)}
                        className="mr-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        title="Assign a task"
                      >
                        Assign Task
                      </button>
                    )}
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`text-sm font-medium transition-colors ${u.status === 'Active'
                        ? 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300'
                        : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                    >
                      {u.status === "Active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id || u._id)}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colspan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUser}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Assign Task Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Task to ${assignTarget?.name}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a complaint to assign to <span className="font-semibold text-gray-800 dark:text-gray-200">{assignTarget?.name}</span>. They will receive a notification.
          </p>
          {complaints.length === 0 ? (
            <div className="text-center py-6 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">
              No open complaints available in your organization.
            </div>
          ) : (
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Complaint
              </label>
              <select
                value={selectedComplaint}
                onChange={e => setSelectedComplaint(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="">-- Choose a complaint --</option>
                {complaints.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    [{c.priority || 'Med'}] [{c.category || 'General'}] {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {assignMsg && (
            <p className={`text-sm font-medium ${assignMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {assignMsg}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignTask}
              disabled={!selectedComplaint || assigning}
              className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors font-medium text-sm"
            >
              {assigning ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageUsers;
