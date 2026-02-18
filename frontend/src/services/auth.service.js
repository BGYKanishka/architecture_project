
import api from "./api";

const register = (name, email, password, role, contactNumber, businessName) => {
  return api.post("/auth/signup", {
    name,
    email,
    password,
    role,
    contactNumber,
    businessName,
  });
};

const login = (email, password) => {
  return api
    .post("/auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        // Save user data + token in browser storage
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;