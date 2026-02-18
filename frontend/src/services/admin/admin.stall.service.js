import api from "../api";

export async function getAdminStalls() {
    const res = await api.get("/admin/stalls");
    return res.data;
}

export async function createAdminStall(payload) {
    // payload: { code, size }
    const res = await api.post("/admin/stalls", payload);
    return res.data;
}

export async function updateAdminStall(id, payload) {
    // payload: { code?, size?, status? }
    const res = await api.put(`/admin/stalls/${id}`, payload);
    return res.data;
}
