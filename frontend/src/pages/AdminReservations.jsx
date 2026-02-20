import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminReservations } from "../services/admin/admin.reservation.service";
import AdminHeader from "../components/common/AdminHeader";

export default function AdminReservations() {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setErr("");
        setLoading(true);
        try {
            const data = await getAdminReservations();
            setList(data);
        } catch (e) {
            setErr("Cannot load reservations. Token/Backend issue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString();
    };

    const statusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "CONFIRMED": return "bg-green-100 text-green-700";
            case "PENDING": return "bg-yellow-100 text-yellow-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminHeader />

            {/* Page Title Bar */}
            <div className="max-w-6xl mx-auto px-4 pt-6 pb-2 flex items-center gap-3">
                <Link to="/admin/dashboard" className="p-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition text-sm font-medium">← Back</Link>
                <h1 className="text-xl font-bold text-slate-900">Reservation Monitoring</h1>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
                {/* List Panel */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="p-6 flex items-center justify-between">
                        <h2 className="font-semibold">Reservation List</h2>
                        {loading && <span className="text-sm text-slate-500">Loading...</span>}
                    </div>

                    {err && (
                        <div className="mx-6 mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                            {err}
                        </div>
                    )}

                    <div className="divide-y">
                        {list.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setSelected(r)}
                                className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition ${selected?.id === r.id ? "bg-blue-50" : ""}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Reservation #{r.id}</p>
                                        <p className="text-xs text-slate-500">
                                            {r.userName} ({r.userEmail})
                                        </p>
                                    </div>
                                    <span className={`text-xs rounded px-2 py-1 font-medium ${statusColor(r.status)}`}>
                                        {r.status}
                                    </span>
                                </div>
                            </button>
                        ))}

                        {list.length === 0 && !loading && (
                            <div className="px-6 py-6 text-slate-500">No reservations found.</div>
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold">Reservation Detail</h2>

                    {!selected ? (
                        <p className="text-sm text-slate-500 mt-2">
                            Click a reservation to view details.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="rounded-lg bg-slate-50 p-4 space-y-1">
                                <p className="font-semibold">Reservation #{selected.id}</p>
                                <p className="text-slate-600">Name: {selected.userName}</p>
                                <p className="text-slate-600">Email: {selected.userEmail}</p>
                                <p className="text-slate-600">Date: {formatDate(selected.reservationDate)}</p>
                                <p className="text-slate-600">
                                    Status:{" "}
                                    <span className={`rounded px-2 py-0.5 font-medium ${statusColor(selected.status)}`}>
                                        {selected.status}
                                    </span>
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="font-semibold mb-3">Booked Stalls</p>
                                {selected.stalls?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {selected.stalls.map(s => (
                                            <li key={s.id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                                <span className="font-medium text-slate-700">Stall {s.stallCode}</span>
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold ${s.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {s.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 text-xs text-center py-2 italic flex justify-center w-full">No stall details available</p>
                                )}
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4 mt-2">
                                <p className="text-slate-500 text-xs mb-1">QR Token</p>
                                <p className="font-mono break-all text-xs">{selected.qrCodeToken}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
