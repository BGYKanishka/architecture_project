import api from "../api";

// ── New availability view endpoints ───────────────────────────

/**
 * GET /api/admin/stalls/availability
 * Returns all stalls with statusLabel + vendor info when reserved.
 */
export async function getStallAvailability() {
    const res = await api.get("/admin/stalls/availability");
    return res.data;
}

/**
 * PATCH /api/admin/stalls/{id}/toggle-disabled
 * Toggles the disabled flag for a stall.
 * Returns updated StallAvailabilityResponse or 409 if stall is reserved.
 */
export async function toggleStallDisabled(id) {
    const res = await api.patch(`/admin/stalls/${id}/toggle-disabled`);
    return res.data;
}

// ── Legacy endpoints (kept for other consumers) ───────────────

export async function getAdminStalls() {
    const res = await api.get("/admin/stalls");
    return res.data;
}

export async function createAdminStall(payload) {
    const res = await api.post("/admin/stalls", payload);
    return res.data;
}

export async function updateAdminStall(id, payload) {
    const res = await api.put(`/admin/stalls/${id}`, payload);
    return res.data;
}
