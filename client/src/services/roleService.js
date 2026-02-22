import axios from 'axios';

const API_URL = 'http://localhost:5000/api/roles';

const getRoles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const addRole = async (roleData) => {
    const response = await axios.post(API_URL, roleData);
    return response.data;
};

const deleteRole = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export default {
    getRoles,
    addRole,
    deleteRole
};
