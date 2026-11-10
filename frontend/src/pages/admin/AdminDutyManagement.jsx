import { useEffect, useState } from "react";
import { getAllDuties, createDuty, updateDuty, deleteDuty, getAllEmployees } from "../../services/admin/admin.duty.service";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/common/AdminHeader";
import {
    ArrowLeftIcon,
    PlusIcon,
    CalendarIcon,
    TrashIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function AdminDutyManagement() {
    const [duties, setDuties] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ description: "", startTime: "", endTime: "", status: "ASSIGNED", assignedToId: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [dutiesData, employeesData] = await Promise.all([getAllDuties(), getAllEmployees()]);
            setDuties(dutiesData);
            setEmployees(employeesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.assignedToId) {
            alert("Please select an employee");
            return;
        }

        try {
            if (editingId) {
                await updateDuty(editingId, form, form.assignedToId);
            } else {
                await createDuty(form, form.assignedToId);
            }
            setForm({ description: "", startTime: "", endTime: "", status: "ASSIGNED", assignedToId: "" });
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error("Failed to save duty:", error);
            alert("Failed to save duty");
        }
    };

    const handleEdit = (duty) => {
        setEditingId(duty.id);
        setForm({
            description: duty.description,
            startTime: duty.startTime,
            endTime: duty.endTime,
            status: duty.status,
            assignedToId: duty.assignedTo?.id || ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this duty assignment?")) return;
        try {
            await deleteDuty(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete duty:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-16 font-sans">
            <AdminHeader />

            <div className="max-w-6xl mx-auto px-4 pt-8 pb-3">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/dashboard"
                            className="p-2 rounded-lg border border-slate-800 bg-[#0f1422] text-slate-400 hover:text-white hover:border-slate-700 transition"
                            title="Back to Dashboard"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Staff Duty Management</h1>
                            <p className="text-xs text-slate-400 mt-0.5">Assign shifts, hall monitoring duties and schedules to staff</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f1422] border border-slate-800 p-6 rounded-xl mb-8">
                    <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-indigo-400" />
                        {editingId ? "Edit Duty Assignment" : "Assign New Duty Shift"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Shift Description (e.g. Hall A Morning Verification)"
                            className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            required
                        />
                        <select
                            className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            value={form.assignedToId}
                            onChange={e => setForm({ ...form, assignedToId: e.target.value })}
                            required
                        >
                            <option value="">Select Staff Member</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name || emp.email} ({emp.role})</option>
                            ))}
                        </select>
                        <div>
                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Shift Start</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Shift End</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-wrap gap-4 items-center justify-between pt-2">
                            <select
                                className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 max-w-xs"
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="ASSIGNED">Assigned</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <div className="flex gap-2">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingId(null); setForm({ description: "", startTime: "", endTime: "", status: "ASSIGNED", assignedToId: "" }); }}
                                        className="px-4 py-2 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                                >
                                    {editingId ? "Update Duty" : "Assign Duty"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-[#0f1422] border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#0b0f19] border-b border-slate-800 text-slate-400 font-semibold">
                            <tr>
                                <th className="p-4">Description</th>
                                <th className="p-4">Assigned Staff</th>
                                <th className="p-4">Start Time</th>
                                <th className="p-4">End Time</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading duty assignments...</td></tr>
                            ) : duties.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No duty shifts recorded.</td></tr>
                            ) : (
                                duties.map(duty => (
                                    <tr key={duty.id} className="hover:bg-slate-800/30 transition">
                                        <td className="p-4 font-bold text-white">{duty.description}</td>
                                        <td className="p-4 text-slate-300">{duty.assignedTo?.name || duty.assignedTo?.email}</td>
                                        <td className="p-4 text-slate-400">{new Date(duty.startTime).toLocaleString()}</td>
                                        <td className="p-4 text-slate-400">{new Date(duty.endTime).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border
                                                ${duty.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    duty.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                                {duty.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(duty)}
                                                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(duty.id)}
                                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
