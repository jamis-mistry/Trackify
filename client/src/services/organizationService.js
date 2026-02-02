// Later replace with backend base URL
const API_URL = "http://localhost:5000/api/organization";

// Helper to attach token
const _getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("trackify_user") || "{}");
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// Get organization users
const getUsers = async () => {
  // REAL VERSION
  // return axios.get(`${API_URL}/users`, getAuthHeader());

  // MOCK
  return [];
};

// Create user (Organization)
const createUser = async () => {
  // REAL VERSION
  // return axios.post(`${API_URL}/users`, data, getAuthHeader());

  // MOCK
  return true;
};

// Update user status or role
const updateUser = async () => {
  // REAL VERSION
  // return axios.put(`${API_URL}/users/${id}`, data, getAuthHeader());

  // MOCK
  return true;
};

export default {
  getUsers,
  createUser,
  updateUser,
};
