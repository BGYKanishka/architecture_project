import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminReservations } from "../../services/admin/admin.reservation.service";
import AdminHeader from "../../components/common/AdminHeader";
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    QrCodeIcon,
} from "@heroicons/react/24/outline";

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
        } catch {
            setErr("Cannot load reservations. Please verify backend service.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString();
    };

    const statusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case "CONFIRMED":
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Confirmed
                    </span>
                );
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Pending
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        {status || "Unknown"}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-16">
            <AdminHeader />

            {/* Page Title Bar */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/admin/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                            <ArrowLeftIcon className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-xs text-indigo-400 font-medium">Reservations</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Reservation Monitoring</h1>
                </div>

                <button
                    onClick={load}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition"
                >
                    <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>{loading ? "Loading…" : "Refresh"}</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
                {/* List Panel */}
                <div className="bg-[#0f1422] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="font-semibold text-white text-sm">Active Bookings</h2>
                        <span className="text-xs text-slate-500">{list.length} total</span>
                    </div>

                    {err && (
                        <div className="m-4 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 px-3.5 py-2.5 text-xs">
                            {err}
                        </div>
                    )}

                    <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[580px]">
                        {list.map((r) => {
                            const isSelected = selected?.id === r.id;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => setSelected(r)}
                                    className={`w-full text-left px-4 py-3.5 transition flex items-center justify-between ${
                                        isSelected ? "bg-slate-800/60 border-l-2 border-indigo-500" : "hover:bg-slate-800/30"
                                    }`}
                                >
                                    <div>
                                        <p className="font-semibold text-white text-sm">Reservation #{r.id}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {r.userName} <span className="text-slate-500">({r.userEmail})</span>
                                        </p>
                                    </div>
                                    <div>
                                        {statusBadge(r.status)}
                                    </div>
                                </button>
                            );
                        })}

                        {list.length === 0 && !loading && (
                            <div className="px-6 py-16 text-center text-slate-500 text-xs">
                                No reservations found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                        <h2 className="font-semibold text-white text-sm">Booking Details</h2>
                        {selected && (
                            <span className="text-xs text-indigo-400 font-mono">
                                ID #{selected.id}
                            </span>
                        )}
                    </div>

                    {!selected ? (
                        <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center justify-center">
                            <ClipboardDocumentCheckIcon className="w-8 h-8 text-slate-700 mb-2 stroke-1" />
                            Select a reservation from the list to inspect.
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4 text-xs">
                            <div className="rounded-lg bg-[#0b0f19] border border-slate-800 p-3.5 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Publisher</span>
                                    <span className="font-medium text-white">{selected.userName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Email</span>
                                    <span className="text-slate-300">{selected.userEmail}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Date</span>
                                    <span className="text-slate-300">{formatDate(selected.reservationDate)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                                    <span className="text-slate-400">Status</span>
                                    {statusBadge(selected.status)}
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-800 p-3.5">
                                <p className="font-semibold text-white mb-2.5 text-xs">Assigned Stalls</p>
                                {selected.stalls?.length > 0 ? (
                                    <ul className="space-y-1.5">
                                        {selected.stalls.map(s => (
                                            <li key={s.id} className="flex justify-between items-center bg-[#0b0f19] p-2.5 rounded border border-slate-800">
                                                <span className="font-medium text-white">Stall {s.stallCode}</span>
                                                <span className={`text-[11px] font-medium ${s.status === 'CONFIRMED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {s.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 text-xs text-center py-2 italic">No stall details linked</p>
                                )}
                            </div>

                            <div className="rounded-lg border border-slate-800 p-3.5 bg-[#0b0f19]/40">
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1 font-medium">
                                    <QrCodeIcon className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>QR Verification Token</span>
                                </div>
                                <p className="font-mono text-xs text-indigo-300 bg-[#0b0f19] p-2 rounded border border-slate-800 break-all select-all">
                                    {selected.qrCodeToken || "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
