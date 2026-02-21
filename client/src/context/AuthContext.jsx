import React, { useState, useEffect } from "react";
import { createContext } from "react";
import complaintService from "../services/complaintService";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("trackify_user");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth init error", err);
      }
    }
    setLoading(false);
  }, []);

  // --- LocalStorage Helper ---
  const getStoredUsers = () => {
    const stored = localStorage.getItem('trackify_db_users');
    return stored ? JSON.parse(stored) : [];
  };

  const getStoredComplaints = () => {
    const stored = localStorage.getItem('trackify_db_complaints');
    return stored ? JSON.parse(stored) : [];
  };

  const updateStoredUsers = (users) => {
    localStorage.setItem('trackify_db_users', JSON.stringify(users));
  };

  const updateStoredComplaints = (complaints) => {
    localStorage.setItem('trackify_db_complaints', JSON.stringify(complaints));
  };

  // Seed Admin if empty or update if old admin exists
  useEffect(() => {
    const users = getStoredUsers();

    // Reliable Admin Fix: Find any admin or specific email and force consistency
    const adminIndex = users.findIndex(u => u.email === "admin01@gmail.com" || u.email === "admin@gmail.com" || u.role === 'admin');

    if (adminIndex !== -1) {
      // Update existing admin
      let updated = false;
      if (users[adminIndex].email !== "admin01@gmail.com") { users[adminIndex].email = "admin01@gmail.com"; updated = true; }
      if (users[adminIndex].password !== "admin@123") { users[adminIndex].password = "admin@123"; updated = true; }
      if (users[adminIndex].role !== "admin") { users[adminIndex].role = "admin"; updated = true; }
      if (!users[adminIndex].organizationName) { users[adminIndex].organizationName = "Trackify Corp"; updated = true; }

      if (updated) {
        console.log("Admin credentials/data patched in localStorage");
        updateStoredUsers(users);
      }
    } else {
      // specific admin not found, inject it
      const seedAdmin = {
        _id: "admin-seed-forced",
        name: "Super Admin",
        email: "admin01@gmail.com",
        password: "admin@123",
        role: "admin",
        organizationName: "Trackify Corp",
        createdAt: new Date().toISOString()
      };
      users.push(seedAdmin);
      updateStoredUsers(users);
      console.log("Admin account injected");
    }

    // Migration: Fix missing organizationName for existing organizations AND users
    let dbUpdated = false;
    users.forEach(u => {
      // Fix Organization Admins (role: organization)
      if (u.role === 'organization' && u.orgName && !u.organizationName) {
        u.organizationName = u.orgName;
        dbUpdated = true;
      }

      // Fix Regular Users (role: user) - Assign to Default Org if missing (Self-healing)
      if (u.role === 'user' && !u.organizationName) {
        u.organizationName = "Acme Inc."; // Default fallback
        dbUpdated = true;
      }

      // Fix active session if matched
      if (dbUpdated) { // simplified check, might run a bit extra but safe
        const storedSession = localStorage.getItem("trackify_user");
        if (storedSession) {
          const sessionUser = JSON.parse(storedSession);
          if (sessionUser.email === u.email && !sessionUser.organizationName) {
            sessionUser.organizationName = u.organizationName || "Acme Inc.";
            localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
            setUser(sessionUser); // Force state update
          }
        }
      }
    });
    if (dbUpdated) updateStoredUsers(users);

    // Force Seed Org if missing (Migration fix) - runs regardless of admin existence
    const orgExists = users.some(u => u.role === 'organization');
    if (!orgExists) {
      // Only seed Org if it's missing. Use push directly since we might have just updated admin
      const seedOrg = {
        _id: "org-seed",
        name: "Acme Inc.",
        email: "org@trackify.com",
        password: "password123",
        role: "organization",
        organizationName: "Acme Inc.",
        createdAt: new Date().toISOString()
      };
      users.push(seedOrg);
      updateStoredUsers(users);
    }

    // Initial Seed if completely empty (fallback)
    if (users.length === 0) {
      const seedAdmin = {
        _id: "admin-seed",
        name: "Super Admin",
        email: "admin01@gmail.com",
        password: "admin@123",
        role: "admin",
        organizationName: "Trackify Corp",
        createdAt: new Date().toISOString()
      };

      const seedOrg = {
        _id: "org-seed",
        name: "Acme Inc.",
        email: "org@trackify.com",
        password: "password123",
        role: "organization",
        organizationName: "Acme Inc.",
        createdAt: new Date().toISOString()
      };
      updateStoredUsers([seedAdmin, seedOrg]);
    }
  }, []);

  const login = async (email, password) => {
    // Simulate async
    await new Promise(r => setTimeout(r, 500));

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error("Invalid credentials");
    }

    const userData = { ...foundUser, password: undefined }; // Don't put password in session
    localStorage.setItem("trackify_user", JSON.stringify(userData));
    localStorage.setItem("trackify_token", "mock-jwt-token"); // Fake token
    setUser(userData);
    setIsAuthenticated(true);
    return { success: true, data: userData, token: "mock-jwt-token" };
  };

  const register = async (userData) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();

    if (users.find(u => u.email === userData.email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      organizationName: userData.orgName || userData.organizationName, // Ensure consistency
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    updateStoredUsers(users);

    // Auto login
    const sessionUser = { ...newUser, password: undefined };
    localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
    localStorage.setItem("trackify_token", "mock-jwt-token");
    setUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true, data: sessionUser, token: "mock-jwt-token" };
  };

  // --- Mocking other features ---

  const forgotPassword = async (email) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("User not found");

    // In local mode, we just say it worked. 
    // We could store "otp" in localStorage if we really wanted to verify.
    // Let's store a mock OTP
    localStorage.setItem("trackify_temp_otp", "123456");
    console.log("MOCK OTP SENT: 123456");
    return { success: true, data: "OTP Sent" };
  };

  const verifyOtp = async (email, otp) => {
    await new Promise(r => setTimeout(r, 300));
    const storedOtp = localStorage.getItem("trackify_temp_otp");
    if (otp !== storedOtp && otp !== "123456") throw new Error("Invalid OTP");
    return { success: true };
  };

  const resetPassword = async (email, otp, password) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) throw new Error("User not found");

    users[idx].password = password;
    updateStoredUsers(users);

    // Auto login
    const sessionUser = { ...users[idx], password: undefined };
    localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
    setUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, data: sessionUser, token: "mock-new-token" };
  };

  const getMockUsers = async () => {
    // Return all users from LS (except passwords)
    return getStoredUsers().map(({ password, ...u }) => u);
  };

  const getMockComplaints = async (filters = {}) => {
    // Backward compatibility for legacy code passing only userId as string
    const actualFilters = typeof filters === 'string' ? { userId: filters } : filters;
    const { userId, organization } = actualFilters;

    try {
      const all = await complaintService.getAllComplaints();
      let filtered = all;
      if (userId) filtered = filtered.filter(c => c.userId === userId || c.user === userId);
      if (organization) filtered = filtered.filter(c => c.organization === organization || c.organizationName === organization);
      return filtered;
    } catch (e) {
      const all = getStoredComplaints();
      let filtered = all;
      if (userId) filtered = filtered.filter(c => c.userId === userId || c.user === userId);
      if (organization) filtered = filtered.filter(c => c.organization === organization || c.organizationName === organization);
      return filtered;
    }
  };

  // ---- Org Notification Helper ----
  // Pushes a notification into the org's notification bucket.
  // The org account is identified by matching organizationName.
  const notifyOrg = (orgName, notification) => {
    if (!orgName) return;
    // Find the org user record to get their _id
    const users = getStoredUsers();
    const orgUser = users.find(u => u.role === 'organization' && u.organizationName === orgName);
    const orgKey = orgUser ? `trackify_notifs_${orgUser._id}` : `trackify_notifs_org_${orgName}`;
    const existing = JSON.parse(localStorage.getItem(orgKey) || '[]');
    existing.unshift({
      id: Date.now().toString(),
      ...notification,
      time: new Date().toLocaleString(),
      read: false,
    });
    localStorage.setItem(orgKey, JSON.stringify(existing));
  };

  const createComplaint = async (complaintData, files = []) => {
    let result;
    try {
      // Call real backend service
      const res = await complaintService.createComplaint(complaintData, files);
      // Sync with localStorage for legacy components that might still read it
      const all = getStoredComplaints();
      all.push(res);
      updateStoredComplaints(all);
      result = res;
    } catch (e) {
      // Fallback
      const all = getStoredComplaints();
      const newComplaint = {
        id: "CMP-" + Math.floor(1000 + Math.random() * 9000),
        ...complaintData,
        status: "Open",
        createdAt: new Date().toISOString()
      };
      all.push(newComplaint);
      updateStoredComplaints(all);
      result = newComplaint;
    }

    // Notify the organization about the new complaint
    if (complaintData.organization || complaintData.organizationName) {
      const orgName = complaintData.organization || complaintData.organizationName;
      notifyOrg(orgName, {
        type: 'new_complaint',
        title: `New Complaint: ${complaintData.title}`,
        message: `A member submitted a ${complaintData.priority || 'Medium'} priority ${complaintData.category || ''} complaint.`,
        category: complaintData.category,
        priority: complaintData.priority,
        complaintId: result.id || result._id,
      });
    }

    return result;
  };

  // Update task progress & notify org
  const updateTaskProgress = async (complaintId, { progress, status, workNote }) => {
    await new Promise(r => setTimeout(r, 300));
    const all = getStoredComplaints();
    const idx = all.findIndex(c => (c._id || c.id) === complaintId);
    if (idx === -1) throw new Error('Task not found');

    const workerName = user?.name || 'Worker';
    const orgName = all[idx].organization || all[idx].organizationName;

    // Append the new note to existing work log
    const prevLog = all[idx].workLog || [];
    if (workNote?.trim()) {
      prevLog.push({
        note: workNote.trim(),
        progress,
        status,
        by: workerName,
        at: new Date().toISOString(),
      });
    }

    all[idx] = {
      ...all[idx],
      progress: progress ?? all[idx].progress ?? 0,
      status: status || all[idx].status,
      workLog: prevLog,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('trackify_db_complaints', JSON.stringify(all));

    // Notify the org
    notifyOrg(orgName, {
      type: 'worker_update',
      title: `Progress Update: ${all[idx].title}`,
      message: `${workerName} updated task to ${progress}% — "${workNote?.slice(0, 80) || 'No note'}". Status: ${status}.`,
      category: all[idx].category,
      priority: all[idx].priority,
      complaintId,
      workerName,
      progress,
    });

    return all[idx];
  };

  const addUserToOrg = async (userData) => {
    // Check if user has org OR if orgName is provided in userData (for Super Admin adding to specific org)
    let targetOrg = userData.organizationName || user?.organizationName;

    // Fallback: Check strictly against DB if state is stale
    if (!targetOrg && user?.email) {
      const freshUsers = getStoredUsers();
      const freshUser = freshUsers.find(u => u.email === user.email);
      if (freshUser && freshUser.organizationName) {
        targetOrg = freshUser.organizationName;
        // Self-heal session
        const updatedSession = { ...user, organizationName: targetOrg };
        localStorage.setItem("trackify_user", JSON.stringify(updatedSession));
        setUser(updatedSession);
      }
    }

    if (!targetOrg) throw new Error("Organization context missing");

    // Reuse logic
    const users = getStoredUsers();

    // Check if user exists
    const existingUserIndex = users.findIndex(u => u.email === userData.email);

    if (existingUserIndex !== -1) {
      // User exists - Link them to the organization
      users[existingUserIndex].organizationName = targetOrg;
      users[existingUserIndex].orgName = targetOrg; // Consistency

      // If the user's role was just 'user', we might want to keep it or update it?
      // Assuming we keep their existing role unless specifically changing it, 
      // but usually adding to an org implies they are a member.

      updateStoredUsers(users);
      return users[existingUserIndex];
    }

    // Create new user if not exists
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      orgName: targetOrg, // Ensure consistency
      organizationName: targetOrg,
      password: "password123",
      role: userData.role || "user",
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    updateStoredUsers(users);
    return newUser;
  };

  // ---- Worker Assignment Functions ----

  // Get all assignments for a specific worker
  const getWorkerAssignments = (workerId) => {
    const stored = localStorage.getItem('trackify_db_complaints');
    const all = stored ? JSON.parse(stored) : [];
    return all.filter(c => c.assignedWorkerId === workerId);
  };

  // Assign a complaint/task to a worker (used by org admin)
  const assignTaskToWorker = async (complaintId, workerId, workerName) => {
    await new Promise(r => setTimeout(r, 300));
    // Update the complaint record
    const stored = localStorage.getItem('trackify_db_complaints');
    const all = stored ? JSON.parse(stored) : [];
    const idx = all.findIndex(c => (c._id || c.id) === complaintId);
    if (idx === -1) throw new Error('Complaint not found');

    all[idx].assignedWorkerId = workerId;
    all[idx].assignedWorkerName = workerName;
    all[idx].assignedDate = new Date().toISOString();
    all[idx].status = all[idx].status === 'Open' ? 'In Progress' : all[idx].status;
    localStorage.setItem('trackify_db_complaints', JSON.stringify(all));

    // Push notification to worker
    const notifKey = `trackify_notifs_${workerId}`;
    const existing = JSON.parse(localStorage.getItem(notifKey) || '[]');
    existing.unshift({
      title: `New Task Assigned: ${all[idx].title}`,
      message: `You have been assigned a ${all[idx].priority || 'Medium'} priority task in the ${all[idx].category || 'General'} category.`,
      time: new Date().toLocaleString(),
      complaintId,
    });
    localStorage.setItem(notifKey, JSON.stringify(existing));

    return all[idx];
  };

  // Update worker profile (including workerCategories)
  const updateWorkerProfile = async (updates) => {
    await new Promise(r => setTimeout(r, 400));
    if (!user) throw new Error('No user logged in');

    const users = getStoredUsers();
    const idx = users.findIndex(u => u._id === user._id || u.email === user.email);
    if (idx === -1) throw new Error('User record not found');

    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    updateStoredUsers(users);

    const sessionUser = { ...updatedUser, password: undefined };
    localStorage.setItem('trackify_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const deleteUserFromOrg = async (userId) => {
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();

    // Find if user exists and belongs to this organization (basic check)
    const idx = users.findIndex(u => u._id === userId || u.id === userId); // Handle both types of IDs
    if (idx === -1) throw new Error("User not found");

    // Optional: Check if admin is trying to delete themselves usually blocked in UI but good here too
    if (users[idx].email === user?.email) throw new Error("Cannot delete your own account");

    return true;
  };

  const deleteUserAny = async (userId) => {
    // Admin function to delete any user/org
    await new Promise(r => setTimeout(r, 500));
    const users = getStoredUsers();
    const idx = users.findIndex(u => u._id === userId || u.id === userId);
    if (idx === -1) throw new Error("User/Org not found");

    users.splice(idx, 1);
    updateStoredUsers(users);
    return true;
  };

  const findUserByEmail = (email) => {
    const users = getStoredUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const getOrgUsers = async () => {
    // Fetch all users and filter (Simplest migration step without new BE endpoint)
    // Ideally BE should have /api/org/users endpoint
    try {
      const allUsers = await getMockUsers();
      if (!user || (!user.organizationName && user.role !== 'admin')) return [];

      // Filter: match Organization Name
      return allUsers.filter(u => u.organizationName === user.organizationName);
    } catch (e) {
      console.error("Get Org Users failed", e);
      return [];
    }
  };

  const updateUserProfile = async (updates) => {
    // updates: { name, email, profilePicture, ... }
    await new Promise(r => setTimeout(r, 500));

    if (!user) throw new Error("No user logged in");

    const users = getStoredUsers();
    const idx = users.findIndex(u => u._id === user._id || u.email === user.email);

    if (idx === -1) throw new Error("User record not found");

    // Update fields
    const updatedUser = { ...users[idx], ...updates };

    // Save to DB
    users[idx] = updatedUser;
    updateStoredUsers(users);

    // Update Session
    const sessionUser = { ...updatedUser, password: undefined };
    localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
    setUser(sessionUser);

    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem("trackify_user");
    localStorage.removeItem("trackify_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        getMockComplaints,
        createComplaint,
        addUserToOrg,
        deleteUserFromOrg,
        getOrgUsers,
        getMockUsers,
        deleteUserAny,
        updateUserProfile,
        getWorkerAssignments,
        assignTaskToWorker,
        updateWorkerProfile,
        updateTaskProgress,
        notifyOrg,
        findUserByEmail
      }}
    >
      {children}
    </AuthContext.Provider >
  );
};

export default AuthProvider;
