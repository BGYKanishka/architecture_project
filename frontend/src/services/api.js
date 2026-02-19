import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Logging out.");

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_role");
            localStorage.removeItem("admin_username");

            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;