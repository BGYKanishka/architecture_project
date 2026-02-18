import api from "../api";

export async function getAdminEmployees() {
    const res = await api.get("/admin/employees");
    return res.data;
}

export async function createAdminEmployee(employee) {
    const res = await api.post("/admin/employees", employee);
    return res.data;
}

export async function updateAdminEmployee(id, employee) {
    const res = await api.put(`/admin/employees/${id}`, employee);
    return res.data;
}

export async function deleteAdminEmployee(id) {
    const res = await api.delete(`/admin/employees/${id}`);
    return res.data;
}
