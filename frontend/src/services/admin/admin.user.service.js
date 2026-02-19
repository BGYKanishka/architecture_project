import api from "../api";

export async function getAdminUsers(role = "") {
    const params = role ? { role } : {};
    const res = await api.get("/admin/users", { params });
    return res.data;
}

export async function getAdminUserById(id) {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
}

export async function createAdminUser(data) {
    const res = await api.post("/admin/users", data);
    return res.data;
}

export async function updateAdminUser(id, data) {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
}

export async function deleteAdminUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
}

export async function toggleAdminUserEnabled(id) {
    const res = await api.patch(`/admin/users/${id}/toggle-enabled`);
    return res.data;
}
