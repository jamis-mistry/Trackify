import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

const getCategories = async (type) => {
    const response = await axios.get(API_URL, { params: { type } });
    return response.data;
};

const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
};

const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export default {
    getCategories,
    createCategory,
    deleteCategory
};
