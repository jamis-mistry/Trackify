// Later change this to your backend URL
const API_URL = "http://localhost:5000/api/auth";

const login = async (email) => {
  // REAL VERSION (when backend is ready)
  // const response = await axios.post(`${API_URL}/login`, { email, password });
  // return response.data;

  // MOCK VERSION (for now)
  return {
    id: 1,
    name: "John Doe",
    email,
    role: "user", // user | admin | organization
    token: "fake-jwt-token",
  };
};

const register = async () => {
  // REAL VERSION
  // return axios.post(`${API_URL}/register`, userData);

  // MOCK
  return true;
};

const logout = () => {
  localStorage.removeItem("trackify_user");
};

export default {
  login,
  register,
  logout,
};
