import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/common/AdminHeader";
import {
    getAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleAdminUserEnabled,
} from "../../services/admin/admin.user.service";
import {
    ArrowLeftIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ROLES = ["ALL", "VENDOR", "EMPLOYEE", "ADMIN"];
const PAGE_SIZE = 10;

const EMPTY_FORM = {
    name: "", email: "", role: "VENDOR",
    contactNumber: "", businessName: "", enabled: true,
};

function RoleBadge({ role }) {
    const colors = {
        ADMIN: "text-purple-400 bg-purple-950/40 border-purple-800/50",
        EMPLOYEE: "text-blue-400 bg-blue-950/40 border-blue-800/50",
        VENDOR: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    };
    return (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${colors[role] || "text-slate-400 bg-slate-900 border-slate-800"}`}>
            {role}
        </span>
    );
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErr, setFormErr] = useState("");
    const [saving, setSaving] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleteErr, setDeleteErr] = useState("");

    const load = async () => {
        setLoading(true);
        setLoadError("");
        try {
            const data = await getAdminUsers(roleFilter === "ALL" ? "" : roleFilter);
            setUsers(data);
            setPage(1);
        } catch {
            setLoadError("Failed to load users. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [roleFilter]);

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

    const openAdd = () => {
        setForm(EMPTY_FORM);
        setFormErr("");
        setModal("add");
    };
    const openEdit = (u) => {
        setEditTarget(u);
        setForm({
            name: u.name || "",
            email: u.email || "",
            role: u.role || "VENDOR",
            contactNumber: u.contactNumber || "",
            businessName: u.businessName || "",
            enabled: u.enabled !== false,
        });
        setFormErr("");
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
                const { enabled, ...newUser } = form;
                await createAdminUser(newUser);
            } else {
                await updateAdminUser(editTarget.id, form);
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
            setConfirmDelete(null);
            setDeleteErr("");
            load();
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;
            if (status === 409 && data?.error === "USER_HAS_RESERVATIONS") {
                const count = data.reservationCount ?? "some";
                setDeleteErr(
                    `This user has ${count} reservation${count === 1 ? "" : "s"}. ` +
                    `Deleting is blocked until all reservations are reassigned or cancelled.`
                );
            } else {
                setDeleteErr("Delete failed. Please verify dependencies.");
            }
        }
    };

    const handleToggle = async (u) => {
        try {
            await toggleAdminUserEnabled(u.id);
            load();
        } catch {
            setLoadError("Failed to update user status. Please try again.");
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-16">
            <AdminHeader />

            {/* Page Title Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                            <ArrowLeftIcon className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-xs text-indigo-400 font-medium">Users</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                </div>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

                {loadError && (
                    <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg px-4 py-3 text-xs text-rose-300">
                        {loadError}
                    </div>
                )}

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-1 bg-[#0f1422] border border-slate-800 rounded-lg p-1">
                        {ROLES.map(r => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setSearch(""); }}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                                    roleFilter === r ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[240px]">
                        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search name, email or business…"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="bg-[#0f1422] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#0f1422] border border-slate-800 rounded-xl overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 text-xs">Loading users…</div>
                    ) : (
                        <table className="w-full text-xs">
                            <thead className="bg-[#0b0f19] border-b border-slate-800 text-slate-400 text-left font-medium">
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
                            <tbody className="divide-y divide-slate-800/80">
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-slate-500">No matching users found.</td>
                                    </tr>
                                ) : paginated.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                                        <td className="px-4 py-3 font-mono text-slate-500">#{u.id}</td>
                                        <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                                        <td className="px-4 py-3 text-slate-300">{u.email}</td>
                                        <td className="px-4 py-3 text-slate-400">{u.contactNumber || "—"}</td>
                                        <td className="px-4 py-3 text-slate-400">{u.businessName || "—"}</td>
                                        <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] font-medium ${u.enabled ? "text-emerald-400" : "text-rose-400"}`}>
                                                {u.enabled ? "Active" : "Disabled"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggle(u)}
                                                    className="text-xs text-slate-400 hover:text-slate-200 font-medium"
                                                >
                                                    {u.enabled ? "Disable" : "Enable"}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(u)}
                                                    className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                                                >
                                                    Delete
                                                </button>
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
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                        <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div className="flex gap-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-2.5 py-1 rounded border border-slate-800 bg-[#0f1422] disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-2.5 py-1 rounded border text-xs font-medium ${
                                        p === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-[#0f1422] border-slate-800 text-slate-400 hover:bg-slate-800"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-2.5 py-1 rounded border border-slate-800 bg-[#0f1422] disabled:opacity-40 hover:bg-slate-800 text-slate-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-sm text-white">
                                {modal === "add" ? "Create User Account" : `Edit User #${editTarget?.id}`}
                            </h2>
                            <button onClick={closeModal} className="p-1 rounded text-slate-400 hover:text-white transition">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
                            {formErr && (
                                <div className="bg-rose-950/40 text-rose-300 text-xs px-3 py-2 rounded-lg border border-rose-800/60">
                                    {formErr}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Name *</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {modal === "add" && (
                                <p className="text-[11px] text-slate-400">
                                    The user signs in through Cognito with this verified email. Their app role is set here.
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Role *</label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleFormChange}
                                        className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="VENDOR">VENDOR</option>
                                        <option value="EMPLOYEE">EMPLOYEE</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Number</label>
                                    <input
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleFormChange}
                                        placeholder="+94 77 123 4567"
                                        className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Business Name</label>
                                <input
                                    name="businessName"
                                    value={form.businessName}
                                    onChange={handleFormChange}
                                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            {modal === "edit" && (
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        name="enabled"
                                        checked={form.enabled}
                                        onChange={handleFormChange}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                                    />
                                    <span>Account Enabled</span>
                                </label>
                            )}

                            <div className="flex gap-2.5 pt-2 border-t border-slate-800">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-medium transition shadow-sm disabled:opacity-60"
                                >
                                    {saving ? "Saving…" : modal === "add" ? "Create User" : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-slate-800 bg-[#0b0f19] py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-3.5">
                        <div className="flex items-center gap-2 text-rose-400">
                            <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                            <h2 className="font-bold text-sm text-white">Delete User Account?</h2>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Are you sure you want to delete <strong className="text-white">{confirmDelete.name}</strong> ({confirmDelete.email})?
                        </p>

                        {deleteErr && (
                            <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-3 text-xs text-rose-300">
                                {deleteErr}
                            </div>
                        )}

                        <div className="flex gap-2 pt-1">
                            {!deleteErr && (
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-xs font-medium transition"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={() => { setConfirmDelete(null); setDeleteErr(""); }}
                                className="flex-1 border border-slate-800 bg-[#0b0f19] py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
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
