import axios from 'axios';

const API_URL = 'http://localhost:5002/api/organization';

// Get all members of an organization
const getOrgUsers = async (organizationName) => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { organizationName }
  });
  return response.data;
};

// Search for any user by email
const searchUserByEmail = async (email) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { email }
  });
  return response.data;
};

// Add (link) a user to an organization
const addUserToOrg = async (email, organizationName) => {
  const response = await axios.post(`${API_URL}/users`, { email, organizationName });
  return response.data;
};

// Remove (unlink) a user from an organization
const removeUserFromOrg = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

// Get org statistics
const getOrgStats = async (organizationName) => {
  const response = await axios.get(`${API_URL}/stats`, {
    params: { organizationName }
  });
  return response.data;
};

export default {
  getOrgUsers,
  searchUserByEmail,
  addUserToOrg,
  removeUserFromOrg,
  getOrgStats
};
