import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getStallAvailability, toggleStallDisabled } from "../services/admin/admin.stall.service";

// ── Constants ────────────────────────────────────────────────
const STATUS_FILTERS = ["ALL", "AVAILABLE", "RESERVED", "DISABLED"];

// ── Sub-components ───────────────────────────────────────────

function StatusBadge({ status }) {
    const cfg = {
        AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
        RESERVED: "bg-rose-100   text-rose-700   border-rose-200",
        DISABLED: "bg-slate-100  text-slate-500  border-slate-200",
    };
    return (
        <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border ${cfg[status] || cfg.DISABLED}`}>
            {status}
        </span>
    );
}

function StallCard({ stall, onClick }) {
    const coloring = {
        AVAILABLE: "bg-emerald-50  border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100",
        RESERVED: "bg-rose-50     border-rose-200    hover:border-rose-400    hover:bg-rose-100",
        DISABLED: "bg-slate-100   border-slate-200   hover:border-slate-400   opacity-70",
    };
    const dot = {
        AVAILABLE: "bg-emerald-400",
        RESERVED: "bg-rose-400",
        DISABLED: "bg-slate-400",
    };
    const s = stall.statusLabel;

    return (
        <button
            onClick={() => onClick(stall)}
            className={`relative rounded-xl border-2 p-3 text-left transition-all cursor-pointer group ${coloring[s] || coloring.DISABLED}`}
        >
            {/* Status dot */}
            <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${dot[s]}`} />

            <p className="font-bold text-sm text-slate-800 leading-tight">{stall.stallCode}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{stall.size}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stall.floorName}</p>
            <div className="mt-2">
                <StatusBadge status={s} />
            </div>
            {stall.reserved && stall.vendorName && (
                <p className="mt-1.5 text-[10px] text-slate-500 truncate">{stall.vendorName}</p>
            )}
        </button>
    );
}

function InfoRow({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className="text-xs text-slate-800 font-medium text-right break-all">{value}</span>
        </div>
    );
}

function StallModal({ stall, onClose, onToggleDisabled, toggling }) {
    if (!stall) return null;
    const s = stall.statusLabel;
    const isReserved = stall.reserved;
    const isDisabled = stall.disabled;

    const headerColor = {
        AVAILABLE: "from-emerald-500 to-emerald-600",
        RESERVED: "from-rose-500    to-rose-600",
        DISABLED: "from-slate-400   to-slate-500",
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString() : "—";

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${headerColor[s] || headerColor.DISABLED} rounded-t-2xl p-5`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{stall.floorName}</p>
                            <h2 className="text-white text-2xl font-bold mt-0.5">{stall.stallCode}</h2>
                            <StatusBadge status={s} />
                        </div>
                        <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
                    </div>
                </div>

                <div className="p-5 space-y-5">
                    {/* Stall details */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Stall Info</h3>
                        <div className="bg-slate-50 rounded-xl px-4">
                            <InfoRow label="Stall ID" value={`#${stall.id}`} />
                            <InfoRow label="Stall Code" value={stall.stallCode} />
                            <InfoRow label="Floor" value={stall.floorName} />
                            <InfoRow label="Size / Type" value={stall.size} />
                            <InfoRow label="Price" value={stall.price ? `LKR ${stall.price.toLocaleString()}` : null} />
                            <InfoRow label="Status" value={s} />
                        </div>
                    </div>

                    {/* Vendor details */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            {isReserved ? "Vendor Details" : "Occupancy"}
                        </h3>
                        {isReserved ? (
                            <div className="space-y-4">
                                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4">
                                    <InfoRow label="Reservation ID" value={`#${stall.reservationId}`} />
                                    <InfoRow label="Reservation Date" value={formatDate(stall.reservationDate)} />
                                    <InfoRow label="Reservation Status" value={stall.reservationStatus} />
                                    <InfoRow label="Vendor ID" value={`#${stall.vendorId}`} />
                                    <InfoRow label="Vendor Name" value={stall.vendorName} />
                                    <InfoRow label="Email" value={stall.vendorEmail} />
                                    <InfoRow label="Contact" value={stall.vendorContact || "—"} />
                                    <InfoRow label="Business" value={stall.vendorBusiness || "—"} />
                                </div>

                                {/* Vendor Genres */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vendor Genres</p>
                                    {stall.vendorGenres && stall.vendorGenres.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {stall.vendorGenres.map((genre, i) => {
                                                const palettes = [
                                                    "bg-violet-100 text-violet-700 border-violet-200",
                                                    "bg-sky-100    text-sky-700    border-sky-200",
                                                    "bg-amber-100  text-amber-700  border-amber-200",
                                                    "bg-pink-100   text-pink-700   border-pink-200",
                                                    "bg-teal-100   text-teal-700   border-teal-200",
                                                    "bg-orange-100 text-orange-700 border-orange-200",
                                                    "bg-indigo-100 text-indigo-700 border-indigo-200",
                                                    "bg-lime-100   text-lime-700   border-lime-200",
                                                ];
                                                return (
                                                    <span
                                                        key={genre}
                                                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${palettes[i % palettes.length]}`}
                                                    >
                                                        {genre}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No genres specified</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <p className="text-sm text-emerald-700 font-medium">
                                    No vendor assigned — stall is {isDisabled ? "disabled" : "available for reservation"}.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Enable / Disable toggle */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Admin Actions</h3>
                        {isReserved ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <p className="text-sm text-amber-700">
                                    Cannot disable a reserved stall. Please wait until the reservation ends.
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={() => onToggleDisabled(stall.id)}
                                disabled={toggling}
                                className={`w-full py-2.5 rounded-xl font-medium text-sm transition
                                    ${isDisabled
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"}
                                    disabled:opacity-50`}
                            >
                                {toggling ? "Updating…" : isDisabled ? "✓ Enable Stall" : "⊘ Disable Stall"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Toast({ msg, type, onClose }) {
    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [msg, onClose]);
    if (!msg) return null;
    return (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-lg text-sm font-medium
            ${type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
            {msg}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────

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
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => setToast({ msg, type });
    const clearToast = () => setToast({ msg: "", type: "success" });

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getStallAvailability();
            setStalls(data);
        } catch {
            setError("Failed to load stalls. Please check the backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // Derive unique filter options from data
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

    // Summary counts
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
            showToast(`Stall ${updated.disabled ? "disabled" : "enabled"} successfully.`);
        } catch (err) {
            const msg = err?.response?.data?.message || "Toggle failed.";
            showToast(msg, "error");
        } finally {
            setToggling(false);
        }
    };

    // Group stalls by floor for display
    const byFloor = useMemo(() => {
        const map = {};
        filtered.forEach(s => {
            if (!map[s.floorName]) map[s.floorName] = [];
            map[s.floorName].push(s);
        });
        return map;
    }, [filtered]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Stall Availability</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Click any stall to view details and vendor information</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={load}
                            disabled={loading}
                            className="border border-slate-200 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100 disabled:opacity-50"
                        >
                            {loading ? "Loading…" : "↻ Refresh"}
                        </button>
                        <Link to="/admin/dashboard" className="border border-slate-200 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100">
                            ← Back
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "Total Stalls", value: counts.total, color: "text-slate-700", bg: "bg-white" },
                        { label: "Available", value: counts.available, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Reserved", value: counts.reserved, color: "text-rose-600", bg: "bg-rose-50" },
                        { label: "Disabled", value: counts.disabled, color: "text-slate-500", bg: "bg-slate-100" },
                    ].map(c => (
                        <div key={c.label} className={`${c.bg} rounded-xl p-4 border border-slate-100 shadow-sm`}>
                            <p className="text-xs text-slate-500">{c.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
                    {/* Status tabs */}
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition
                                    ${statusFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Floor filter */}
                    <select
                        value={floorFilter}
                        onChange={e => setFloorFilter(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {floors.map(f => <option key={f} value={f}>{f === "ALL" ? "All Floors" : f}</option>)}
                    </select>

                    {/* Size filter */}
                    <select
                        value={sizeFilter}
                        onChange={e => setSizeFilter(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {sizes.map(s => <option key={s} value={s}>{s === "ALL" ? "All Sizes" : s}</option>)}
                    </select>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search stall code or vendor…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <span className="text-xs text-slate-400 ml-auto">{filtered.length} stall{filtered.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Stall grid — grouped by floor */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400 text-sm">Loading stalls…</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-sm">No stalls match the current filters.</div>
                ) : (
                    Object.keys(byFloor).sort().map(floorName => (
                        <div key={floorName}>
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="font-semibold text-slate-700 text-sm">{floorName}</h2>
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-xs text-slate-400">{byFloor[floorName].length} stalls</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                                {byFloor[floorName].map(stall => (
                                    <StallCard key={stall.id} stall={stall} onClick={setSelected} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stall detail modal */}
            <StallModal
                stall={selected}
                onClose={() => setSelected(null)}
                onToggleDisabled={handleToggleDisabled}
                toggling={toggling}
            />
        </div>
    );
}
