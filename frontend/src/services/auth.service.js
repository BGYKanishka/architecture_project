import api from "./api";

const USER_KEY = "user";

const getCurrentUser = () => {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const fetchCurrentUser = async () => {
  await api.get("/auth/csrf");
  const response = await api.get("/auth/me");
  sessionStorage.setItem(USER_KEY, JSON.stringify(response.data));
  window.dispatchEvent(new Event("user-updated"));
  return response.data;
};

const login = () => {
  window.location.assign("/oauth2/authorization/cognito");
};

const register = () => {
  window.location.assign("/oauth2/authorization/cognito?prompt=signup");
};

const logout = async () => {
  let logoutUrl = "/";
  try {
    await api.get("/auth/csrf");
    const response = await api.post("/auth/logout");
    logoutUrl = response.data.logoutUrl || logoutUrl;
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("user-updated"));
    window.location.assign(logoutUrl);
  }
};

const AuthService = { login, register, logout, getCurrentUser, fetchCurrentUser };

export default AuthService;
