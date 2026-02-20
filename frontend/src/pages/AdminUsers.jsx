import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/admin/layout/AdminHeader";
import {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminUserEnabled,
} from "../services/admin/admin.user.service";

const ROLES = ["ALL", "VENDOR", "EMPLOYEE", "ADMIN"];
const PAGE_SIZE = 10;

const EMPTY_FORM = {
    name: "", email: "", password: "", role: "VENDOR",
    contactNumber: "", businessName: "", enabled: true,
};

function Badge({ role }) {
    const colors = {
        ADMIN: "bg-purple-100 text-purple-700",
        EMPLOYEE: "bg-blue-100 text-blue-700",
        VENDOR: "bg-green-100 text-green-700",
    };
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors[role] || "bg-slate-100 text-slate-600"}`}>
            {role}
        </span>
    );
}

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    if (!msg) return null;
    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
            {msg}
        </div>
    );
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState(null); // null | "add" | "edit"
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showPw, setShowPw] = useState(false);
    const [formErr, setFormErr] = useState("");
    const [saving, setSaving] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null); // user object
    const [deleteErr, setDeleteErr] = useState("");            // inline error inside dialog
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => setToast({ msg, type });
    const clearToast = () => setToast({ msg: "", type: "success" });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getAdminUsers(roleFilter === "ALL" ? "" : roleFilter);
            setUsers(data);
            setPage(1);
        } catch {
            showToast("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [roleFilter]);

    // Client-side search across name, email, businessName
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return users;
        return users.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.businessName?.toLowerCase().includes(q)
        );
    }, [users, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── Modal helpers ──
    const openAdd = () => {
        setForm(EMPTY_FORM);
        setFormErr("");
        setShowPw(false);
        setModal("add");
    };
    const openEdit = (u) => {
        setEditTarget(u);
        setForm({
            name: u.name || "",
            email: u.email || "",
            password: "",
            role: u.role || "VENDOR",
            contactNumber: u.contactNumber || "",
            businessName: u.businessName || "",
            enabled: u.enabled !== false,
        });
        setFormErr("");
        setShowPw(false);
        setModal("edit");
    };
    const closeModal = () => { setModal(null); setEditTarget(null); };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErr("");
        setSaving(true);
        try {
            if (modal === "add") {
                if (!form.password) { setFormErr("Password is required."); setSaving(false); return; }
                await createAdminUser(form);
                showToast("User created successfully.");
            } else {
                await updateAdminUser(editTarget.id, form);
                showToast("User updated successfully.");
            }
            closeModal();
            load();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data || "Operation failed.";
            setFormErr(String(msg));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await deleteAdminUser(confirmDelete.id);
            showToast("User deleted successfully.");
            setConfirmDelete(null);
            setDeleteErr("");
            load();
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;
            if (status === 409 && data?.error === "USER_HAS_RESERVATIONS") {
                // Show specific message inline inside the dialog — dialog stays open
                const count = data.reservationCount ?? "some";
                setDeleteErr(
                    `This user has ${count} reservation${count === 1 ? "" : "s"}. ` +
                    `Deleting is blocked until all reservations are reassigned or cancelled.`
                );
            } else {
                setDeleteErr("Delete failed. Please try again or contact support.");
            }
        }
    };

    const handleToggle = async (u) => {
        try {
            await toggleAdminUserEnabled(u.id);
            showToast(`User ${u.enabled ? "disabled" : "enabled"}.`);
            load();
        } catch {
            showToast("Toggle failed.", "error");
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

    return (
        <div className="min-h-screen bg-slate-50">
            <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />
            <AdminHeader />

            {/* Page Title Bar */}
            <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/admin/dashboard" className="p-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition text-sm font-medium">← Back</Link>
                    <h1 className="text-xl font-bold text-slate-900">User Management</h1>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    + Add User
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-6 space-y-4">

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    {/* Role tabs */}
                    <div className="flex gap-1 bg-white border rounded-xl p-1">
                        {ROLES.map(r => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setSearch(""); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
                                    ${roleFilter === r ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search by name, email or business…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="border rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">Loading…</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b text-slate-500 text-left">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Contact</th>
                                    <th className="px-4 py-3">Business</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-10 text-slate-400">No users found.</td>
                                    </tr>
                                ) : paginated.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-slate-400">#{u.id}</td>
                                        <td className="px-4 py-3 font-medium">{u.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                        <td className="px-4 py-3 text-slate-500">{u.contactNumber || "—"}</td>
                                        <td className="px-4 py-3 text-slate-500">{u.businessName || "—"}</td>
                                        <td className="px-4 py-3"><Badge role={u.role} /></td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${u.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                                {u.enabled ? "Active" : "Disabled"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{formatDate(u.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                >Edit</button>
                                                <button
                                                    onClick={() => handleToggle(u)}
                                                    className={`text-xs px-2 py-1 rounded ${u.enabled ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                                                >{u.enabled ? "Disable" : "Enable"}</button>
                                                <button
                                                    onClick={() => setConfirmDelete(u)}
                                                    className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                                >Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center text-sm text-slate-500">
                        <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div className="flex gap-1">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-slate-100">
                                ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`px-3 py-1 rounded border ${p === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-slate-100"}`}>
                                    {p}
                                </button>
                            ))}
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-slate-100">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ── */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="px-6 py-5 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-lg">
                                {modal === "add" ? "Add New User" : `Edit User #${editTarget?.id}`}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {formErr && (
                                <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg border border-red-200">
                                    {formErr}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
                                    <input name="name" value={form.name} onChange={handleFormChange} required
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                                    <input name="email" type="email" value={form.email} onChange={handleFormChange} required
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Password {modal === "edit" && <span className="text-slate-400">(leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPw ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleFormChange}
                                        required={modal === "add"}
                                        placeholder={modal === "edit" ? "••••••••" : ""}
                                        className="w-full border rounded-lg px-3 py-2 text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
                                    >{showPw ? "Hide" : "Show"}</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Role *</label>
                                    <select name="role" value={form.role} onChange={handleFormChange}
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="VENDOR">VENDOR</option>
                                        <option value="EMPLOYEE">EMPLOYEE</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Contact Number</label>
                                    <input name="contactNumber" value={form.contactNumber} onChange={handleFormChange}
                                        placeholder="+94 77 123 4567"
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Business Name <span className="text-slate-400">(optional)</span></label>
                                <input name="businessName" value={form.businessName} onChange={handleFormChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            {modal === "edit" && (
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleFormChange} className="w-4 h-4" />
                                    Account Enabled
                                </label>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition">
                                    {saving ? "Saving…" : modal === "add" ? "Create User" : "Save Changes"}
                                </button>
                                <button type="button" onClick={closeModal}
                                    className="flex-1 border border-slate-200 py-2 rounded-lg text-sm hover:bg-slate-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation ── */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
                        <h2 className="font-semibold text-lg text-slate-900">Delete User?</h2>
                        <p className="text-sm text-slate-600">
                            Are you sure you want to permanently delete{" "}
                            <strong>{confirmDelete.name}</strong> ({confirmDelete.email})?
                            This action cannot be undone.
                        </p>

                        {/* Inline error — shown when backend blocks the delete */}
                        {deleteErr && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-red-500 text-base leading-none mt-0.5">⚠️</span>
                                    <p className="text-sm text-red-700 font-medium">{deleteErr}</p>
                                </div>
                                <p className="text-xs text-red-500 pl-6">
                                    Suggestion: Reassign or cancel reservations before deleting this user.
                                </p>
                                <div className="pl-6">
                                    <a
                                        href="/admin/reservations"
                                        className="text-xs text-blue-600 underline hover:text-blue-800"
                                    >
                                        View Reservations →
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            {/* Hide destructive button when blocked by FK constraint */}
                            {!deleteErr && (
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                                >
                                    Yes, Delete
                                </button>
                            )}
                            <button
                                onClick={() => { setConfirmDelete(null); setDeleteErr(""); }}
                                className="flex-1 border py-2 rounded-lg text-sm hover:bg-slate-50"
                            >
                                {deleteErr ? "Close" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
