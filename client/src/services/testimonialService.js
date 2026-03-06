import axios from 'axios';

const API_URL = 'http://localhost:5002/api/testimonials';

// Get all approved testimonials (for public page)
const getTestimonials = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching testimonials', error);
        return [];
    }
};

// Get all testimonials including unapproved (for admin)
const getAllTestimonialsAdmin = async () => {
    try {
        const response = await axios.get(`${API_URL}?all=true`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all testimonials', error);
        return [];
    }
};

// Create a testimonial
const createTestimonial = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return { success: true, data: response.data.data };
    } catch (error) {
        console.error('Error creating testimonial', error);
        return { success: false, error: error?.response?.data?.error || 'Failed to create testimonial' };
    }
};

// Delete a testimonial
const deleteTestimonial = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial', error);
        return { success: false };
    }
};

// Toggle approval
const toggleApproval = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/approve`);
        return { success: true, data: response.data.data };
    } catch (error) {
        console.error('Error toggling approval', error);
        return { success: false };
    }
};

export default {
    getTestimonials,
    getAllTestimonialsAdmin,
    createTestimonial,
    deleteTestimonial,
    toggleApproval,
};
