import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAdminEmployees,
    createAdminEmployee,
    updateAdminEmployee,
    deleteAdminEmployee,
} from "../services/admin/admin.employee.service";

const EMPTY_FORM = { name: "", employeeCode: "", designation: "" };

export default function AdminEmployees() {
    const [employees, setEmployees] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [toast, setToast] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // null = add, object = edit
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErr, setFormErr] = useState("");
    const [saving, setSaving] = useState(false);

    // Delete confirm
    const [deleteId, setDeleteId] = useState(null);

    /* ── Load ── */
    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const data = await getAdminEmployees();
            setEmployees(data);
            setFiltered(data);
        } catch {
            setErr("Failed to load employees. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    /* ── Search / filter ── */
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            employees.filter(
                (e) =>
                    e.name?.toLowerCase().includes(q) ||
                    e.employeeCode?.toLowerCase().includes(q) ||
                    e.designation?.toLowerCase().includes(q)
            )
        );
    }, [search, employees]);

    /* ── Toast helper ── */
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    /* ── Modal helpers ── */
    const openAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormErr("");
        setShowModal(true);
    };

    const openEdit = (emp) => {
        setEditTarget(emp);
        setForm({ name: emp.name, employeeCode: emp.employeeCode, designation: emp.designation });
        setFormErr("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormErr("");
    };

    /* ── Validate ── */
    const validate = () => {
        if (!form.name.trim()) return "Name is required.";
        if (!form.employeeCode.trim()) return "Employee Code is required.";
        if (!form.designation.trim()) return "Designation is required.";
        return "";
    };

    /* ── Save (add or edit) ── */
    const handleSave = async (e) => {
        e.preventDefault();
        const validationErr = validate();
        if (validationErr) { setFormErr(validationErr); return; }

        setSaving(true);
        setFormErr("");
        try {
            if (editTarget) {
                await updateAdminEmployee(editTarget.id, form);
                showToast("Employee updated successfully.");
            } else {
                await createAdminEmployee(form);
                showToast("Employee added successfully.");
            }
            closeModal();
            await load();
        } catch {
            setFormErr("Save failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteAdminEmployee(deleteId);
            showToast("Employee deleted.");
            setDeleteId(null);
            await load();
        } catch {
            setErr("Delete failed. Please try again.");
            setDeleteId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Employee Management</h1>
                    <Link className="text-blue-600 text-sm" to="/admin/dashboard">← Back to Dashboard</Link>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm">
                    {toast}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <input
                        type="text"
                        placeholder="Search by name, code, or designation…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={openAdd}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Employee
                    </button>
                </div>

                {/* Error */}
                {err && (
                    <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">
                        {err}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    {loading ? (
                        <div className="px-6 py-10 text-center text-slate-500 text-sm">Loading employees…</div>
                    ) : filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center text-slate-500 text-sm">
                            {search ? "No employees match your search." : "No employees found. Add one!"}
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold text-slate-600">ID</th>
                                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Employee Code</th>
                                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Designation</th>
                                    <th className="text-right px-6 py-3 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 text-slate-400">#{emp.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{emp.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                                                {emp.employeeCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{emp.designation}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEdit(emp)}
                                                className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(emp.id)}
                                                className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                        <h2 className="text-lg font-bold mb-4">
                            {editTarget ? "Edit Employee" : "Add Employee"}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. EMP-001"
                                    value={form.employeeCode}
                                    onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Floor Supervisor"
                                    value={form.designation}
                                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {formErr && (
                                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                    {formErr}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition"
                                >
                                    {saving ? "Saving…" : editTarget ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Dialog */}
            {deleteId && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
                        <h2 className="text-lg font-bold mb-2">Delete Employee?</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
