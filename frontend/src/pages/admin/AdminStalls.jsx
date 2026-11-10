import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getStallAvailability, toggleStallDisabled } from "../../services/admin/admin.stall.service";
import AdminHeader from "../../components/common/AdminHeader";
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    CheckCircleIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const STATUS_FILTERS = ["ALL", "AVAILABLE", "RESERVED", "DISABLED"];

function StatusBadge({ status }) {
    if (status === "AVAILABLE") {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Available
            </span>
        );
    }
    if (status === "RESERVED") {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Reserved
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Disabled
        </span>
    );
}

function StallCard({ stall, onClick }) {
    const coloring = {
        AVAILABLE: "bg-[#0f1422] border-slate-800 hover:border-slate-700 text-slate-200",
        RESERVED: "bg-[#0f1422] border-slate-800 hover:border-slate-700 text-slate-400",
        DISABLED: "bg-[#0b0f19] border-slate-800/60 text-slate-500 opacity-60",
    };
    const s = stall.statusLabel;

    return (
        <button
            onClick={() => onClick(stall)}
            className={`rounded-lg border p-3 text-left transition cursor-pointer flex flex-col justify-between ${coloring[s] || coloring.DISABLED}`}
        >
            <div>
                <p className="font-bold text-sm text-white">{stall.stallCode}</p>
                <p className="text-[11px] text-slate-400">{stall.size} • {stall.floorName}</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full flex items-center justify-between">
                <StatusBadge status={s} />
                {stall.price && (
                    <span className="text-[11px] text-slate-400 font-mono">
                        {(stall.price / 1000).toFixed(0)}k
                    </span>
                )}
            </div>
        </button>
    );
}

function InfoRow({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between gap-4 py-2 border-b border-slate-800/80 last:border-0 text-xs">
            <span className="text-slate-400 shrink-0">{label}</span>
            <span className="text-white font-medium text-right break-all">{value}</span>
        </div>
    );
}

function StallModal({ stall, onClose, onToggleDisabled, toggling }) {
    if (!stall) return null;
    const s = stall.statusLabel;
    const isReserved = stall.reserved;
    const isDisabled = stall.disabled;

    const formatDate = (d) => d ? new Date(d).toLocaleString() : "—";

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{stall.floorName}</p>
                        <h2 className="text-2xl font-bold text-white mt-0.5">{stall.stallCode}</h2>
                        <div className="mt-1">
                            <StatusBadge status={s} />
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Stall Information</h3>
                        <div className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-1">
                            <InfoRow label="Stall ID" value={`#${stall.id}`} />
                            <InfoRow label="Stall Code" value={stall.stallCode} />
                            <InfoRow label="Floor" value={stall.floorName} />
                            <InfoRow label="Size Category" value={stall.size} />
                            <InfoRow label="Rental Price" value={stall.price ? `LKR ${stall.price.toLocaleString()}` : null} />
                            <InfoRow label="Status" value={s} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            {isReserved ? "Assigned Publisher" : "Occupancy"}
                        </h3>
                        {isReserved ? (
                            <div className="space-y-3">
                                <div className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3.5 py-1">
                                    <InfoRow label="Reservation ID" value={`#${stall.reservationId}`} />
                                    <InfoRow label="Booking Date" value={formatDate(stall.reservationDate)} />
                                    <InfoRow label="Publisher Name" value={stall.vendorName} />
                                    <InfoRow label="Email" value={stall.vendorEmail} />
                                    <InfoRow label="Contact" value={stall.vendorContact || "—"} />
                                    <InfoRow label="Business" value={stall.vendorBusiness || "—"} />
                                </div>

                                {stall.vendorGenres && stall.vendorGenres.length > 0 && (
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1.5">Registered Genres:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {stall.vendorGenres.map((genre) => (
                                                <span
                                                    key={genre}
                                                    className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3.5 flex items-center gap-2.5">
                                <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                <p className="text-xs text-slate-300">
                                    No publisher assigned — stall is {isDisabled ? "currently disabled" : "open for public reservation"}.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {isReserved ? (
                            <div className="bg-[#0b0f19] border border-slate-800 rounded-lg p-3 flex items-start gap-2 text-xs text-slate-400">
                                <ExclamationTriangleIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>Active reservation present. Stalls cannot be disabled while booked.</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => onToggleDisabled(stall.id)}
                                disabled={toggling}
                                className={`w-full py-2 rounded-lg font-medium text-xs transition ${
                                    isDisabled
                                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                } disabled:opacity-50`}
                            >
                                {toggling ? "Updating..." : isDisabled ? "Enable Stall for Booking" : "Disable Stall"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminStalls() {
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [floorFilter, setFloorFilter] = useState("ALL");
    const [sizeFilter, setSizeFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const [selected, setSelected] = useState(null);
    const [toggling, setToggling] = useState(false);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getStallAvailability();
            setStalls(data);
        } catch {
            setError("Failed to load stalls. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const floors = useMemo(() => {
        const names = [...new Set(stalls.map(s => s.floorName))].sort();
        return ["ALL", ...names];
    }, [stalls]);

    const sizes = useMemo(() => {
        const sizeList = [...new Set(stalls.map(s => s.size))].sort();
        return ["ALL", ...sizeList];
    }, [stalls]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return stalls.filter(s => {
            if (statusFilter !== "ALL" && s.statusLabel !== statusFilter) return false;
            if (floorFilter !== "ALL" && s.floorName !== floorFilter) return false;
            if (sizeFilter !== "ALL" && s.size !== sizeFilter) return false;
            if (q && !s.stallCode.toLowerCase().includes(q) &&
                !(s.vendorName?.toLowerCase().includes(q))) return false;
            return true;
        });
    }, [stalls, statusFilter, floorFilter, sizeFilter, search]);

    const counts = useMemo(() => ({
        total: stalls.length,
        available: stalls.filter(s => s.statusLabel === "AVAILABLE").length,
        reserved: stalls.filter(s => s.statusLabel === "RESERVED").length,
        disabled: stalls.filter(s => s.statusLabel === "DISABLED").length,
    }), [stalls]);

    const handleToggleDisabled = async (id) => {
        setToggling(true);
        try {
            const updated = await toggleStallDisabled(id);
            setStalls(prev => prev.map(s => s.id === id ? updated : s));
            setSelected(updated);
        } catch {
            // Error handling
        } finally {
            setToggling(false);
        }
    };

    const byFloor = useMemo(() => {
        const map = {};
        filtered.forEach(s => {
            if (!map[s.floorName]) map[s.floorName] = [];
            map[s.floorName].push(s);
        });
        return map;
    }, [filtered]);

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
                        <span className="text-xs text-indigo-400 font-medium">Stalls</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Stall Inventory</h1>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Summary numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#0f1422] rounded-xl p-4 border border-slate-800">
                        <p className="text-xs text-slate-400">Total Stalls</p>
                        <p className="text-2xl font-bold text-white mt-1">{counts.total}</p>
                    </div>
                    <div className="bg-[#0f1422] rounded-xl p-4 border border-slate-800">
                        <p className="text-xs text-slate-400">Available</p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{counts.available}</p>
                    </div>
                    <div className="bg-[#0f1422] rounded-xl p-4 border border-slate-800">
                        <p className="text-xs text-slate-400">Reserved</p>
                        <p className="text-2xl font-bold text-rose-400 mt-1">{counts.reserved}</p>
                    </div>
                    <div className="bg-[#0f1422] rounded-xl p-4 border border-slate-800">
                        <p className="text-xs text-slate-400">Disabled</p>
                        <p className="text-2xl font-bold text-slate-400 mt-1">{counts.disabled}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#0f1422] rounded-xl border border-slate-800 p-4 flex flex-wrap gap-3 items-center">
                    {/* Status tabs */}
                    <div className="flex gap-1 bg-[#0b0f19] border border-slate-800 rounded-lg p-1">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                                    statusFilter === f ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <select
                        value={floorFilter}
                        onChange={e => setFloorFilter(e.target.value)}
                        className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                        {floors.map(f => <option key={f} value={f}>{f === "ALL" ? "All Wings" : f}</option>)}
                    </select>

                    <select
                        value={sizeFilter}
                        onChange={e => setSizeFilter(e.target.value)}
                        className="bg-[#0b0f19] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                        {sizes.map(s => <option key={s} value={s}>{s === "ALL" ? "All Sizes" : s}</option>)}
                    </select>

                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search code or publisher…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-[#0b0f19] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-full focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <span className="text-xs text-slate-500 ml-auto font-medium">{filtered.length} stall{filtered.length !== 1 ? "s" : ""}</span>
                </div>

                {error && (
                    <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg px-4 py-3 text-xs text-rose-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-slate-500 text-xs">Loading stall inventory…</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 text-xs">No stalls match the selected filter.</div>
                ) : (
                    Object.keys(byFloor).sort().map(floorName => (
                        <div key={floorName} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-white text-sm tracking-wide">{floorName}</h2>
                                <div className="flex-1 h-px bg-slate-800" />
                                <span className="text-xs text-slate-500 font-medium">{byFloor[floorName].length} stalls</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                                {byFloor[floorName].map(stall => (
                                    <StallCard key={stall.id} stall={stall} onClick={setSelected} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <StallModal
                stall={selected}
                onClose={() => setSelected(null)}
                onToggleDisabled={handleToggleDisabled}
                toggling={toggling}
            />
        </div>
    );
}
