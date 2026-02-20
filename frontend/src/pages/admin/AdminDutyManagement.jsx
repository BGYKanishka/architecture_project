import { useEffect, useState } from "react";
import { getAllDuties, createDuty, updateDuty, deleteDuty, getAllEmployees } from "../../services/admin/admin.duty.service";
import { Link } from "react-router-dom";

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
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteDuty(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete duty:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Duty Management</h1>
                    <Link to="/admin/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Duty" : "Assign New Duty"}</h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Description"
                            className="border p-2 rounded"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            required
                        />
                        <select
                            className="border p-2 rounded"
                            value={form.assignedToId}
                            onChange={e => setForm({ ...form, assignedToId: e.target.value })}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name || emp.email} ({emp.role})</option>
                            ))}
                        </select>
                        <input
                            type="datetime-local"
                            className="border p-2 rounded"
                            value={form.startTime}
                            onChange={e => setForm({ ...form, startTime: e.target.value })}
                            required
                        />
                        <input
                            type="datetime-local"
                            className="border p-2 rounded"
                            value={form.endTime}
                            onChange={e => setForm({ ...form, endTime: e.target.value })}
                            required
                        />
                        <select
                            className="border p-2 rounded"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="ASSIGNED">Assigned</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                            {editingId ? "Update Duty" : "Assign Duty"}
                        </button>
                    </form>
                    {editingId && (
                        <button
                            onClick={() => { setEditingId(null); setForm({ description: "", startTime: "", endTime: "", status: "ASSIGNED", assignedToId: "" }); }}
                            className="mt-2 text-gray-500 hover:text-gray-700"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b">
                            <tr>
                                <th className="p-4">Description</th>
                                <th className="p-4">Assigned To</th>
                                <th className="p-4">Start Time</th>
                                <th className="p-4">End Time</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
                            ) : duties.length === 0 ? (
                                <tr><td colSpan="6" className="p-4 text-center">No duties found.</td></tr>
                            ) : (
                                duties.map(duty => (
                                    <tr key={duty.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4">{duty.description}</td>
                                        <td className="p-4">{duty.assignedTo?.name || duty.assignedTo?.email}</td>
                                        <td className="p-4">{new Date(duty.startTime).toLocaleString()}</td>
                                        <td className="p-4">{new Date(duty.endTime).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                                                ${duty.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    duty.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'}`}>
                                                {duty.status}
                                            </span>
                                        </td>
                                        <td className="p-4 space-x-2">
                                            <button onClick={() => handleEdit(duty)} className="text-blue-600 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(duty.id)} className="text-red-600 hover:underline">Delete</button>
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
