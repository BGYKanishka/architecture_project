import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
        "Content-Type": "application/json",
    },
});



api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("user");
            window.dispatchEvent(new Event("user-updated"));
        }
        return Promise.reject(error);
    }
);

export default api;
