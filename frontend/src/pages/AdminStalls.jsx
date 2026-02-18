import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createAdminStall, getAdminStalls, updateAdminStall } from "../services/admin/admin.stall.service";

export default function AdminStalls() {
    const [stalls, setStalls] = useState([]);
    const [code, setCode] = useState("");
    const [size, setSize] = useState("SMALL");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const data = await getAdminStalls();
            setStalls(data);
        } catch (e) {
            setErr("Cannot load stalls. Token/Backend issue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!code.trim()) return;
        setErr("");
        try {
            await createAdminStall({ code: code.trim().toUpperCase(), size });
            setCode("");
            await load();
        } catch (e) {
            setErr("Create failed. Code maybe already exists.");
        }
    };

    const setStatus = async (id, status) => {
        setErr("");
        try {
            await updateAdminStall(id, { status });
            await load();
        } catch (e) {
            setErr("Update failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin - Stalls</h1>
                    <Link className="text-blue-600 text-sm" to="/admin/dashboard">← Back</Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold">Create Stall</h2>

                    {err && (
                        <div className="mt-3 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                            {err}
                        </div>
                    )}

                    <div className="mt-4 flex flex-col md:flex-row gap-3">
                        <input
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2"
                            placeholder="Stall code (ex: A1)"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <select
                            className="rounded-lg border border-slate-200 px-3 py-2"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            <option value="SMALL">SMALL</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LARGE">LARGE</option>
                        </select>
                        <button
                            onClick={create}
                            className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                        >
                            Create
                        </button>
                        <button
                            onClick={load}
                            className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-100"
                        >
                            Refresh
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-3">

                    </p>
                </div>

                <div className="mt-6 bg-white rounded-2xl shadow overflow-hidden">
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="font-semibold">All Stalls</h2>
                        {loading && <span className="text-sm text-slate-500">Loading...</span>}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 text-slate-600">
                                <tr>
                                    <th className="text-left px-6 py-3">ID</th>
                                    <th className="text-left px-6 py-3">Code</th>
                                    <th className="text-left px-6 py-3">Size</th>
                                    <th className="text-left px-6 py-3">Status</th>
                                    <th className="text-left px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stalls.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="px-6 py-3">{s.id}</td>
                                        <td className="px-6 py-3 font-semibold">{s.code}</td>
                                        <td className="px-6 py-3">{s.size}</td>
                                        <td className="px-6 py-3">
                                            <span className={
                                                s.status === "AVAILABLE"
                                                    ? "px-2 py-1 rounded bg-green-50 text-green-700"
                                                    : "px-2 py-1 rounded bg-gray-100 text-gray-700"
                                            }>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 flex gap-2">
                                            <button
                                                onClick={() => setStatus(s.id, "AVAILABLE")}
                                                className="text-xs rounded-lg border px-2 py-1 hover:bg-slate-100"
                                            >
                                                AVAILABLE
                                            </button>
                                            <button
                                                onClick={() => setStatus(s.id, "RESERVED")}
                                                className="text-xs rounded-lg border px-2 py-1 hover:bg-slate-100"
                                            >
                                                RESERVED
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {stalls.length === 0 && !loading && (
                                    <tr className="border-t">
                                        <td className="px-6 py-6 text-slate-500" colSpan="5">
                                            No stalls found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
