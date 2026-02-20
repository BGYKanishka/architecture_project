import api from "../api";

export async function getAllDuties() {
    const res = await api.get("/admin/duties");
    return res.data;
}

export async function createDuty(duty, userId) {
    const res = await api.post(`/admin/duties/user/${userId}`, duty);
    return res.data;
}

export async function updateDuty(id, duty, userId) {
    let url = `/admin/duties/${id}`;
    if (userId) {
        url += `/user/${userId}`;
    }
    const res = await api.put(url, duty);
    return res.data;
}

export async function deleteDuty(id) {
    const res = await api.delete(`/admin/duties/${id}`);
    return res.data;
}

export async function getAllEmployees() {
    const res = await api.get("/admin/users/employees");
    return res.data;
}
