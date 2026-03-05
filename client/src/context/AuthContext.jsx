import React, { useState, useEffect, useCallback } from "react";
import complaintService from "../services/complaintService";
import categoryService from "../services/categoryService";
import roleService from "../services/roleService";
import authService from "../services/authService";
import organizationService from "../services/organizationService";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // This will hold both types
  const [roles, setRoles] = useState([]);

  // Session recovery
  useEffect(() => {
    const data = localStorage.getItem("trackify_user");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth init error", err);
        localStorage.removeItem("trackify_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const userData = res.data;
      localStorage.setItem("trackify_user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, data: userData };
    } catch (err) {
      throw new Error(err.response?.data?.error || "Invalid credentials");
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      const sessionUser = res.data;
      localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthenticated(true);
      return { success: true, data: sessionUser };
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || "Registration failed");
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      return res;
    } catch (err) {
      throw new Error(err.response?.data?.error || "User not found");
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await authService.verifyOtp(email, otp);
      return res;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Invalid OTP");
    }
  };

  const resetPassword = async (email, otp, password) => {
    try {
      const res = await authService.resetPassword(email, otp, password);
      const sessionUser = res.data;
      localStorage.setItem("trackify_user", JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthenticated(true);
      return { success: true, data: sessionUser };
    } catch (err) {
      throw new Error(err.response?.data?.error || "Password reset failed");
    }
  };

  const getMockUsers = useCallback(async () => {
    try {
      const response = await authService.getAllUsers();
      return response.data || [];
    } catch (e) {
      console.error('getMockUsers failed', e);
      return [];
    }
  }, []);

  const getMockComplaints = useCallback(async (filters = {}) => {
    // Legacy support for passing string userId
    const params = typeof filters === 'string' ? { userId: filters } : { ...filters };

    // Normalize names for backend
    if (params.organization) {
      params.organizationName = params.organization;
      delete params.organization;
    }

    try {
      return await complaintService.getAllComplaints(params);
    } catch (e) {
      console.error("fetchComplaints failed", e);
      return [];
    }
  }, []);

  const fetchCategories = useCallback(async (type) => {
    try {
      const response = await categoryService.getCategories(type);
      const fetchedCats = response.data;

      if (type) {
        // We add a 'type' property manually to the results because the 
        // specialized backend collections don't store it anymore
        const typedCats = Array.isArray(fetchedCats) ? fetchedCats.map(c => ({ ...c, type })) : [];
        setCategories(prev => {
          // Replace only the ones of this type
          const filtered = prev.filter(c => c.type !== type);
          return [...filtered, ...typedCats];
        });
      } else {
        // If no type, the backend returns an object { issues, workers }
        const issues = (fetchedCats.issues || []).map(c => ({ ...c, type: 'issue' }));
        const workers = (fetchedCats.workers || []).map(c => ({ ...c, type: 'worker' }));
        setCategories([...issues, ...workers]);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await roleService.getRoles();
      const fetchedRoles = data && data.success !== undefined ? data.data : data;
      setRoles(Array.isArray(fetchedRoles) ? fetchedRoles : []);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchRoles();
  }, [fetchCategories, fetchRoles]);

  const addCategory = async (catData) => {
    try {
      const res = await categoryService.createCategory(catData);
      const newCat = res.data;
      // Ensure we track it with type on the frontend
      const typedCat = { ...newCat, type: catData.type };
      setCategories(prev => [...prev, typedCat]);
      return typedCat;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to add category");
    }
  };

  const deleteCategory = async (id, type) => {
    try {
      await categoryService.deleteCategory(id, type);
      setCategories(prev => prev.filter(c => (c._id || c.id) !== id));
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete category");
    }
  };

  const addRole = async (roleData) => {
    try {
      const res = await roleService.addRole(roleData);
      const newRole = res && res.success !== undefined ? res.data : res;
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to add role");
    }
  };

  const deleteRole = async (id) => {
    try {
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(r => r.id !== id && r._id !== id));
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete role");
    }
  };

  const createComplaint = async (complaintData, files = []) => {
    try {
      return await complaintService.createComplaint(complaintData, files);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to create complaint");
    }
  };

  const updateTaskProgress = async (id, data) => {
    try {
      return await complaintService.updateComplaintStatus(id, data);
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update task");
    }
  };

  const addUserToOrg = async (userData) => {
    const organizationName = userData.organizationName || user?.organizationName;
    if (!organizationName) throw new Error('Organization context missing');
    try {
      const res = await organizationService.addUserToOrg(userData.email, organizationName);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to add user to organization");
    }
  };

  const getWorkerAssignments = useCallback(async (workerId) => {
    try {
      return await complaintService.getAllComplaints({ assignedWorkerId: workerId });
    } catch (e) {
      console.error("fetchWorkerAssignments failed", e);
      return [];
    }
  }, []);

  const assignTaskToWorker = async (complaintId, workerId, workerName) => {
    try {
      return await complaintService.updateComplaintStatus(complaintId, {
        assignedWorkerId: workerId,
        assignedWorkerName: workerName,
        assignedDate: new Date().toISOString(),
        status: 'In Progress'
      });
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to assign task");
    }
  };

  const updateWorkerProfile = async (updates) => {
    try {
      const res = await authService.updateUserProfile(updates);
      const userData = res.data;
      localStorage.setItem("trackify_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update profile");
    }
  };

  const deleteUserFromOrg = async (userId) => {
    try {
      await organizationService.removeUserFromOrg(userId);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to remove user");
    }
  };

  const deleteUserAny = async (userId) => {
    try {
      await authService.deleteUser(userId);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Delete failed");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      // Backend handles collective searching in allUsers
      const res = await authService.updateUserRole(userId, newRole);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update role");
    }
  };

  const findUserByEmail = async (email) => {
    try {
      const res = await organizationService.searchUserByEmail(email);
      return res.success ? res.data : null;
    } catch (e) {
      return null;
    }
  };

  const getOrgUsers = async () => {
    try {
      const organizationName = user?.organizationName;
      if (!organizationName) return [];
      const res = await organizationService.getOrgUsers(organizationName);
      return res.success ? res.data : [];
    } catch (e) {
      return [];
    }
  };

  const getOrgStats = async () => {
    try {
      const organizationName = user?.organizationName;
      if (!organizationName) return null;
      const res = await organizationService.getOrgStats(organizationName);
      return res.success ? res.data : null;
    } catch (e) {
      return null;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      const res = await authService.updateUserProfile(updates);
      const userData = res.data;
      localStorage.setItem("trackify_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to update profile");
    }
  };

  const logout = () => {
    authService.logout();
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
        getOrgStats,
        getMockUsers,
        deleteUserAny,
        updateUserRole,
        updateUserProfile,
        getWorkerAssignments,
        assignTaskToWorker,
        updateWorkerProfile,
        updateTaskProgress,
        findUserByEmail,
        categories,
        roles,
        fetchCategories,
        fetchRoles,
        addCategory,
        deleteCategory,
        addRole,
        deleteRole,
      }}
    >
      {children}
    </AuthContext.Provider >
  );
};

export default AuthProvider;
