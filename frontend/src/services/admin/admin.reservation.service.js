import api from "../api";

export async function getAdminReservations() {
    const res = await api.get("/admin/reservations");
    return res.data;
}

export async function getAdminReservationById(id) {
    const res = await api.get(`/admin/reservations/${id}`);
    return res.data;
}
