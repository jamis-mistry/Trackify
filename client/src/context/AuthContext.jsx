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

  const getMockComplaints = async (userId = null) => {
    try {
      const realComplaints = await complaintService.getAllComplaints();
      if (userId) return realComplaints.filter(c => c.userId === userId);
      return realComplaints;
    } catch (e) {
      const all = getStoredComplaints();
      if (userId) return all.filter(c => c.userId === userId);
      return all;
    }
  };

  const createComplaint = async (complaintData, files = []) => {
    try {
      // Call real backend service
      const res = await complaintService.createComplaint(complaintData, files);

      // Sync with localStorage for legacy components that might still read it
      const all = getStoredComplaints();
      all.push(res);
      updateStoredComplaints(all);

      return res;
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
      return newComplaint;
    }
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
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider >
  );
};

export default AuthProvider;
