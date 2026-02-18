import api from "../api";

export async function adminLogin(username, password) {
    const res = await api.post("/auth/admin/login", { username, password });
    // expect response: {token, role, username}
    return res.data;
}

export function adminLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
}
