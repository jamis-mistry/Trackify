import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.success && response.data.user) {
    localStorage.setItem("trackify_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("trackify_user");
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem("trackify_user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;
