// Later replace with backend base URL
const API_URL = "http://localhost:5000/api/complaints";

// Helper to attach token
const _getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("trackify_user") || "{}");
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// Create complaint (User)
const createComplaint = async (data) => {
  // REAL VERSION
  // return axios.post(API_URL, data, getAuthHeader());

  // MOCK
  return {
    id: "CMP-999",
    ...data,
    status: "Open",
  };
};

// Get user complaints
const getMyComplaints = async () => {
  // REAL VERSION
  // return axios.get(`${API_URL}/my`, getAuthHeader());

  // MOCK
  return [];
};

// Get all complaints (Admin / Organization)
const getAllComplaints = async () => {
  // REAL VERSION
  // return axios.get(`${API_URL}/all`, getAuthHeader());

  // MOCK
  return [];
};

// Update complaint status (Admin)
const updateComplaintStatus = async () => {
  // REAL VERSION
  // return axios.put(
  //   `${API_URL}/${id}/status`,
  //   { status, remarks },
  //   getAuthHeader()
  // );

  // MOCK
  return true;
};

export default {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
};
