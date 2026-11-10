import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const isAuthEndpoint = config.url && (config.url.includes("/auth/signin") || config.url.includes("/auth/signup"));
        if (!isAuthEndpoint) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = "Bearer " + token;
            }
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
            const isAuthEndpoint = error.config?.url && error.config.url.includes("/auth/");
            if (!isAuthEndpoint) {
                console.warn("Session expired. Logging out.");

                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.dispatchEvent(new Event("user-updated"));

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;