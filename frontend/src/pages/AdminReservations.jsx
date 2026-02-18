import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminReservationById, getAdminReservations } from "../services/admin/admin.reservation.service";

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

    const viewDetail = async (id) => {
        setErr("");
        try {
            const data = await getAdminReservationById(id);
            setSelected(data);
        } catch (e) {
            setErr("Cannot load reservation detail.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Admin - Reservations</h1>
                    <Link className="text-blue-600 text-sm" to="/admin/dashboard">← Back</Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
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
                                key={r.reservationId}
                                onClick={() => viewDetail(r.reservationId)}
                                className="w-full text-left px-6 py-4 hover:bg-slate-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Reservation #{r.reservationId}</p>
                                        <p className="text-xs text-slate-500">
                                            Vendor: {r.vendorUsername} • {r.createdAt}
                                        </p>
                                    </div>
                                    <span className="text-xs rounded bg-slate-100 px-2 py-1">
                                        {r.stallCodes?.length || 0} stalls
                                    </span>
                                </div>
                            </button>
                        ))}

                        {list.length === 0 && !loading && (
                            <div className="px-6 py-6 text-slate-500">No reservations found.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="font-semibold">Reservation Detail</h2>

                    {!selected ? (
                        <p className="text-sm text-slate-500 mt-2">
                            Click a reservation to view details.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="font-semibold">Reservation #{selected.reservationId}</p>
                                <p className="text-slate-600">
                                    Vendor: {selected.vendorUsername} (ID: {selected.vendorId})
                                </p>
                                <p className="text-slate-600">Created: {selected.createdAt}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-slate-600 text-xs">QR Token</p>
                                <p className="font-mono break-all">{selected.qrCodeValue}</p>
                            </div>

                            <div className="rounded-lg border border-slate-200 p-4">
                                <p className="text-slate-600 text-xs mb-2">Stalls</p>
                                <div className="flex flex-wrap gap-2">
                                    {selected.stallCodes?.map((c) => (
                                        <span key={c} className="rounded bg-blue-50 text-blue-700 px-2 py-1 text-xs">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-xs text-slate-400">
                                Sinhala: reservation එකේ details බලලා stalls reserved ද කියලා verify කරන්න.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
