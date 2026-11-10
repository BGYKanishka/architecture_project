
import api from "./api";

const register = (name, email, password, contactNumber, businessName) => {
  return api.post("/auth/signup", {
    name,
    email,
    password,
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
        window.dispatchEvent(new Event("user-updated"));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("user-updated"));
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
