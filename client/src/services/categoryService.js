import axios from 'axios';

const API_URL = 'http://localhost:5002/api/categories';

const getCategories = async (type) => {
    const response = await axios.get(API_URL, { params: { type } });
    return response.data;
};

const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
};

const deleteCategory = async (id, type) => {
    const response = await axios.delete(`${API_URL}/${id}`, { params: { type } });
    return response.data;
};

export default {
    getCategories,
    createCategory,
    deleteCategory
};
