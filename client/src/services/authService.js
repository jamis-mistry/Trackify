import axios from "axios";

// Later change this to your backend URL
const API_URL = "http://localhost:5002/api/auth";

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("trackify_user");
};

const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
  return response.data;
};

const resetPassword = async (email, otp, password) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email, otp, password });
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData);
  return response.data;
};

const updateUserRole = async (userId, role) => {
  const response = await axios.put(`${API_URL}/users/${userId}/role`, { role });
  return response.data;
};

export default {
  login,
  register,
  getAllUsers,
  deleteUser,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateUserProfile,
  updateUserRole
};
