import axios from 'axios';

const API_URL = "http://localhost:5000/api/complaints";

// Helper to attach token
const _getAuthHeader = () => {
  const token = localStorage.getItem("trackify_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create complaint (User) - Support File Uploads
const createComplaint = async (complaintData, files = []) => {
  try {
    const formData = new FormData();

    // Append all text fields
    Object.keys(complaintData).forEach(key => {
      formData.append(key, complaintData[key]);
    });

    // Append files
    files.forEach(file => {
      formData.append('attachments', file);
    });

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${token}` // If needed
      }
    });

    return response.data.data;
  } catch (error) {
    console.error("Error creating complaint", error);
    // Fallback to mock if backend fails for any reason during development
    return {
      id: "CMP-MOCK-" + Math.floor(Math.random() * 1000),
      ...complaintData,
      status: "Open",
      createdAt: new Date().toISOString()
    };
  }
};

// Get user complaints
const getMyComplaints = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching complaints", error);
    return [];
  }
};

// Get all complaints (Admin / Organization)
const getAllComplaints = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all complaints", error);
    return [];
  }
};

const updateComplaintStatus = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating complaint", error);
    return false;
  }
};

export default {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
};
