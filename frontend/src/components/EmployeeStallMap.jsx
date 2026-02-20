import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employee/service";
import HallShapeWrapper from "./HallShapeWrapper";

// Same coordinate layouts as StallMap (view-only)
const hallLayouts = {
    "Hall A": [
        { top: "6%", left: "36%" },
        { top: "6%", left: "50%" }, { top: "6%", left: "64%" }, { top: "15%", left: "75%" }, { top: "35%", left: "93%" },
        { top: "50%", left: "93%" },
        { top: "65%", left: "93%" }, { top: "80%", left: "77%" },
        { top: "80%", left: "23%" }, { top: "65%", left: "8%" },
        { top: "50%", left: "8%" }, { top: "35%", left: "8%" },
        // Center block
        { top: "35%", left: "36%" }, { top: "35%", left: "64%" },
        { top: "63%", left: "64%" }, { top: "63%", left: "36%" }, { top: "35%", left: "50%" },
        { top: "49%", left: "50%" }, { top: "49%", left: "64%" }, { top: "49%", left: "36%" }
    ],
    "Hall B": [
        { top: "10%", left: "50%" }, { top: "20%", left: "75%" }, { top: "37%", left: "50%" }, { top: "73%", left: "75%" },
        { top: "65%", left: "50%" }, { top: "90%", left: "50%" }, { top: "73%", left: "25%" }, { top: "20%", left: "25%" }
    ],
    "Hall C": [
        { top: "10%", left: "80%" },
        { top: "5%", left: "5%" }, { top: "20%", left: "5%" }, { top: "35%", left: "5%" }, { top: "50%", left: "5%" }, { top: "65%", left: "5%" },
        { top: "30%", left: "80%" }, { top: "50%", left: "80%" }, { top: "70%", left: "80%" }, { top: "90%", left: "80%" }, { top: "90%", left: "60%" }, { top: "90%", left: "40%" }
    ],
    "Hall D": [
        { top: "10%", left: "20%" },
        { top: "5%", left: "95%" }, { top: "20%", left: "95%" }, { top: "35%", left: "95%" }, { top: "50%", left: "95%" }, { top: "65%", left: "95%" },
        { top: "30%", left: "20%" }, { top: "50%", left: "20%" }, { top: "70%", left: "20%" }, { top: "90%", left: "20%" }, { top: "90%", left: "40%" }, { top: "90%", left: "60%" }
    ],
    "Hall E": [
        { top: "20%", left: "20%" }, { top: "20%", left: "80%" }, { top: "20%", left: "50%" }, { top: "80%", left: "20%" }, { top: "80%", left: "80%" }
    ],
    "Hall F": [
        { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
        { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
        { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
    ],
    "Hall G": [
        { top: "20%", left: "15%" }, { top: "20%", left: "32.5%" }, { top: "20%", left: "50%" }, { top: "20%", left: "67.5%" }, { top: "20%", left: "85%" },
        { top: "50%", left: "15%" }, { top: "50%", left: "32.5%" }, { top: "50%", left: "50%" }, { top: "50%", left: "67.5%" }, { top: "50%", left: "85%" },
        { top: "80%", left: "15%" }, { top: "80%", left: "32.5%" }, { top: "80%", left: "50%" }, { top: "80%", left: "67.5%" }, { top: "80%", left: "85%" }
    ]
};

const hallDoors = {
    "Hall A": [{ label: "Entrance", top: "92%", left: "50%" }, { label: "Exit", top: "15%", left: "23%" }],
    "Hall B": [{ label: "Entrance", top: "50%", left: "5%" }, { label: "Exit", top: "50%", left: "95%" }],
    "Hall C": [{ label: "Entrance", top: "83%", left: "15%" }, { label: "Exit", top: "5%", left: "50%" }],
    "Hall D": [{ label: "Entrance", top: "80%", left: "80%" }, { label: "Exit", top: "5%", left: "50%" }],
    "Hall E": [{ label: "Entrance", top: "90%", left: "50%" }, { label: "Exit", top: "50%", left: "95%" }],
    "Hall F": [{ label: "Entrance", top: "5%", left: "50%" }, { label: "Exit", top: "95%", left: "50%" }],
    "Hall G": [
        { label: "01", top: "10%", left: "5%" },
        { label: "02", top: "10%", left: "95%" },
        { label: "03", top: "50%", left: "98%" },
        { label: "04", top: "90%", left: "95%" },
        { label: "05", top: "90%", left: "5%" }
    ]
};

/** Returns tailwind class for stall colour – same palette as StallMap but read-only */
const getSizeColor = (size, isReserved) => {
    if (isReserved) return "bg-gray-300 border-gray-400 text-gray-500 cursor-default";
    switch (size) {
        case "SMALL": return "bg-emerald-100 border-emerald-400 text-emerald-800 cursor-default";
        case "MEDIUM": return "bg-cyan-100    border-cyan-400    text-cyan-800    cursor-default";
        case "LARGE": return "bg-violet-100  border-violet-400  text-violet-800  cursor-default";
        default: return "bg-white border-gray-300 cursor-default";
    }
};

const EmployeeStallMap = ({ hallName }) => {
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hover state
    const [hoveredStall, setHoveredStall] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [isHoverLoading, setIsHoverLoading] = useState(false);

    // QR Modal state
    const [qrModal, setQrModal] = useState(null); // { stallCode, price, floor }
    const closeQrModal = useCallback(() => setQrModal(null), []);
    const openQrModal = useCallback((stall) => {
        const num = stall.stallCode?.split("-")[1] || stall.stallCode;
        setQrModal({
            stallCode: stall.stallCode,
            number: num,
            price: stall.price,
            floor: stall.floorName,
        });
    }, []);

    useEffect(() => {
        employeeService.getEmployeeStalls()
            .then(res => { setStalls(res.data); setLoading(false); })
            .catch(err => { console.error("Error loading stalls:", err); setError("Failed to load stall data."); setLoading(false); });
    }, []);

    const activeFloorStalls = hallName
        ? stalls
            .filter(s => s.floorName === hallName.replace("Hall ", ""))
            .sort((a, b) => a.stallCode.localeCompare(b.stallCode))
        : [];

    const currentLayout = hallLayouts[hallName];

    // List of halls for sidebar navigation
    const halls = ["Hall A", "Hall B", "Hall C", "Hall D", "Hall E", "Hall F", "Hall G"];

    // Real API fetch for hover details
    const fetchStallDetails = (stallId) => {
        // Use the new service method
        return employeeService.getStallDetails(stallId)
            .then(res => res.data)
            .catch(err => {
                console.error("Failed to fetch details", err);
                return null;
            });
    };

    const handleMouseEnter = (e, stall) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Adjust position to keep it on screen if needed, simple logic for now
        let leftPos = rect.right + 10;
        if (leftPos + 300 > window.innerWidth) {
            leftPos = rect.left - 310; // Move to left if no space on right
        }

        setHoverPosition({
            x: leftPos,
            y: rect.top
        });

        // Optimistic / Loading state
        setIsHoverLoading(true);
        setHoveredStall({ ...stall, isLoading: true });

        fetchStallDetails(stall.stallId || stall.id).then((details) => {
            if (details) {
                setHoveredStall(prev => (prev && (prev.id === details.stallId || prev.stallId === details.stallId)
                    ? { ...details, isLoading: false }
                    : prev));
            }
            setIsHoverLoading(false);
        });
    };

    const handleMouseLeave = () => {
        setHoveredStall(null);
        setIsHoverLoading(false);
    };

    // ── QR modal close on Escape (must be before any early returns) ──
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") closeQrModal(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeQrModal]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-gray-500 font-medium text-lg">
            <span>Loading stalls...</span>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen text-red-500 font-medium text-lg">{error}</div>
    );

    // Determine status label + colours for the new card
    const getStatusStyle = (stall) => {
        if (!stall) return {};
        const ps = stall.paymentStatus;
        if (ps === "PAID" || stall.reserved) {
            if (ps === "PENDING") return { label: "PENDING", bg: "#FFF3CD", color: "#856404", dot: "#F59E0B" };
            return { label: "OCCUPIED", bg: "#D1FAE5", color: "#065F46", dot: "#10B981" };
        }
        if (ps === "PENDING") return { label: "PENDING", bg: "#FFF3CD", color: "#856404", dot: "#F59E0B" };
        return { label: "AVAILABLE", bg: "#ECFDF5", color: "#065F46", dot: "#10B981" };
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden relative">

            {/* ── Animation keyframes injected once ── */}
            <style>{`
                @keyframes stallCardIn {
                    from { opacity: 0; transform: scale(0.92) translateY(6px); }
                    to   { opacity: 1; transform: scale(1)   translateY(0); }
                }
                .stall-hover-card { animation: stallCardIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both; }
            `}</style>

            {/* ── Hover Card Overlay ── */}
            {hoveredStall && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{ top: hoverPosition.y, left: hoverPosition.x }}
                >
                    {hoveredStall.isLoading ? (
                        /* compact loading skeleton */
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[300px] flex items-center gap-3 text-gray-400">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                            <span className="text-sm font-medium">Fetching stall details…</span>
                        </div>
                    ) : (() => {
                        const status = getStatusStyle(hoveredStall);
                        const stallNum = hoveredStall.stallCode?.split("-")[1] || hoveredStall.stallCode;
                        const qrData = encodeURIComponent(
                            `STALL:${hoveredStall.stallCode}|PRICE:${hoveredStall.price}|FLOOR:${hoveredStall.floorName}`
                        );
                        const bookingTime = hoveredStall.bookingDate
                            ? new Date(hoveredStall.bookingDate).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "Today, 2:30 PM";

                        return (
                            <div
                                className="stall-hover-card select-none"
                                style={{
                                    width: "300px",
                                    background: "rgba(255,255,255,0.92)",
                                    backdropFilter: "blur(20px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                    borderRadius: "18px",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)",
                                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                                    overflow: "hidden",
                                }}
                            >

                                {/* ── HEADER: Stall ID + Status Badge ── */}
                                <div style={{
                                    background: "linear-gradient(135deg, #1e3a5f 0%, #0f2540 100%)",
                                    padding: "14px 16px 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2px" }}>STALL IDENTIFICATION</p>
                                        <p style={{ color: "#fff", fontSize: "22px", fontWeight: "800", lineHeight: 1, letterSpacing: "-0.5px" }}>
                                            {hoveredStall.stallCode}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        background: status.bg,
                                        color: status.color,
                                        padding: "4px 9px",
                                        borderRadius: "999px",
                                        fontSize: "10px",
                                        fontWeight: "800",
                                        letterSpacing: "0.1em"
                                    }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: status.dot, display: "inline-block" }}></span>
                                        {status.label}
                                    </div>
                                </div>

                                {/* ── BODY ── */}
                                <div style={{ padding: "12px 16px 0" }}>

                                    {/* Customer Details */}
                                    <p style={{ fontSize: "9px", color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Customer Details</p>

                                    {/* Name */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                        <span style={{ fontSize: "14px", flexShrink: 0 }}>👤</span>
                                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {hoveredStall.vendorName || "—"}
                                        </span>
                                    </div>

                                    {/* Contact row: phone + email */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "6px", paddingLeft: "22px" }}>
                                        {hoveredStall.vendorContact ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.64 19.79 19.79 0 012 1.18 2 2 0 013.96 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                                                <span style={{ fontSize: "11px", color: "#374151" }}>{hoveredStall.vendorContact}</span>
                                            </div>
                                        ) : null}
                                        {hoveredStall.vendorEmail ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                                <span style={{ fontSize: "11px", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{hoveredStall.vendorEmail}</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Booking Time */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "22px", marginBottom: "10px" }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span style={{ fontSize: "11px", color: "#6B7280" }}>Booked: <strong style={{ color: "#374151" }}>{bookingTime}</strong></span>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ height: "1px", background: "#F3F4F6", margin: "2px 0 10px" }} />

                                    {/* Transaction Details + QR side by side */}
                                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "12px" }}>

                                        {/* Left: transaction fields */}
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "9px", color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>Transaction</p>

                                            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 10px", alignItems: "center" }}>
                                                <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500 }}>Price</span>
                                                <span style={{ fontSize: "12px", fontWeight: "800", color: "#111827" }}>₱{(hoveredStall.price || 0).toLocaleString()}</span>

                                                <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500 }}>Size</span>
                                                <span style={{
                                                    fontSize: "10px", fontWeight: "800",
                                                    color: (hoveredStall.stallSize || hoveredStall.size) === "LARGE" ? "#7C3AED"
                                                        : (hoveredStall.stallSize || hoveredStall.size) === "MEDIUM" ? "#0369A1"
                                                            : "#059669"
                                                }}>
                                                    {(hoveredStall.stallSize || hoveredStall.size || "—").toUpperCase()}
                                                </span>

                                                <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500 }}>Floor</span>
                                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#374151" }}>{hoveredStall.floorName || "—"}</span>
                                            </div>
                                        </div>

                                        {/* Right: QR code */}
                                        <div style={{ textAlign: "center", flexShrink: 0 }}>
                                            <div style={{
                                                background: "#fff",
                                                border: "1.5px solid #E5E7EB",
                                                borderRadius: "10px",
                                                padding: "5px",
                                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                                            }}>
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&margin=2&data=${qrData}`}
                                                    alt={`QR for ${hoveredStall.stallCode}`}
                                                    width={72}
                                                    height={72}
                                                    style={{ display: "block", imageRendering: "crisp-edges", borderRadius: "6px" }}
                                                />
                                            </div>
                                            <p style={{ fontSize: "8px", color: "#9CA3AF", marginTop: "4px", lineHeight: 1.2, maxWidth: "80px" }}>Scan for details</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── FOOTER ── */}
                                <div style={{
                                    borderTop: "1px solid #F3F4F6",
                                    padding: "7px 16px",
                                    background: "rgba(249,250,251,0.85)",
                                    textAlign: "center"
                                }}>
                                    <p style={{ fontSize: "9px", color: "#D1D5DB", letterSpacing: "0.05em" }}>🔒 Confidential — For Internal Use Only</p>
                                </div>

                            </div>
                        );
                    })()}
                </div>
            )}

            {/* ── Sidebar Navigation ── */}
            <aside className="w-1/4 max-w-xs bg-white shadow-xl flex flex-col z-20 overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-extrabold text-blue-900 uppercase tracking-wide">
                        CIBF 2026
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Floor Plan Navigation</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {halls.map((hall) => (
                        <button
                            key={hall}
                            onClick={() => navigate(`/employee/floor-plan/${encodeURIComponent(hall)}`)}
                            className={`w-full text-left px-5 py-3 rounded-lg font-medium transition-all duration-200 ${hallName === hall
                                ? "bg-blue-600 text-white shadow-md transform scale-[1.02]"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            {hall}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs flex items-start gap-2">
                        <span className="text-lg">🔒</span>
                        <div>
                            <strong>Employee Access</strong>
                            <p className="mt-1 opacity-90">Read-only mode enabled.</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto relative bg-slate-50 p-6 md:p-10">

                {/* ── Top Bar ── */}
                <div className="max-w-5xl mx-auto flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-800">{hallName} — Stall Overview</h2>
                            {/* View-Only Badge */}
                            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider border border-gray-300">
                                View Only
                            </span>
                        </div>

                        {/* Size legend */}
                        <div className="flex gap-4 text-sm mt-3 text-gray-600">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-emerald-100 border border-emerald-400 rounded-sm"></span> Small
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-cyan-100 border border-cyan-400 rounded-sm"></span> Medium
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-violet-100 border border-violet-400 rounded-sm"></span> Large
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            // Logic to logout or go back to a main landing if one existed
                            // For now, maybe refresh or just visual. 
                            // Or navigates to home but authentication might kick in.
                            // Let's keep it as "Exit" to login or similar if needed, 
                            // But usually sidebar is enough. 
                            // Keeping "Back to Map" might be redundant with sidebar, 
                            // so let's remove or change to a "Logout / Exit" visual if requested? 
                            // The user didn't explicitly ask for a specific button here, 
                            // but requested "Hall navigation sidebar".
                            // I will leave this area clean or maybe add a user profile snippet.
                        }}
                        className="hidden"
                    >
                    </button>
                </div>

                {/* ── Hall Map Container ── */}
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-[600px] flex items-center justify-center relative">
                    <HallShapeWrapper hallName={hallName}>
                        {activeFloorStalls.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p>No stalls found for {hallName}.</p>
                            </div>
                        ) : (
                            <div className={`w-full h-full relative`}>

                                {/* Doors / Entrances */}
                                {hallDoors[hallName]?.map((door, idx) => (
                                    <div
                                        key={`door-${idx}`}
                                        className={`absolute flex items-center justify-center font-bold text-white shadow-lg z-10 
                                            ${door.label.length <= 2 ? "w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-sm" : "px-3 py-1 rounded bg-green-600 text-xs border border-white"}
                                        `}
                                        style={{ top: door.top, left: door.left, transform: "translate(-50%, -50%)" }}
                                        title={door.label.length <= 2 ? `Entrance ${door.label}` : door.label}
                                    >
                                        {door.label}
                                    </div>
                                ))}

                                {/* Stalls */}
                                {activeFloorStalls.map((stall, index) => {
                                    const pos = currentLayout && currentLayout[index] ? currentLayout[index] : {};
                                    const isReserved = stall.reserved;
                                    const colorClass = getSizeColor(stall.stallSize || stall.size, isReserved);

                                    // For grid fallback if layout is missing (shouldn't happen for defined halls)
                                    // Using absolute positioning from layout

                                    return (
                                        <div
                                            key={stall.stallId || stall.id}
                                            // Title attribute removed to prevent default tooltip clashing with hover card
                                            // title={isReserved ? `Reserved — ${stall.vendorName || "Active Vendor"}` : `Available — ₹${stall.price}`}
                                            onMouseEnter={(e) => handleMouseEnter(e, stall)}
                                            onMouseLeave={handleMouseLeave}
                                            style={
                                                currentLayout
                                                    ? {
                                                        position: "absolute",
                                                        top: pos.top,
                                                        left: pos.left,
                                                        width: (stall.stallSize || stall.size) === "LARGE" ? "13%" : (stall.stallSize || stall.size) === "MEDIUM" ? "11%" : "9%",
                                                        height: (stall.stallSize || stall.size) === "LARGE" ? "13%" : (stall.stallSize || stall.size) === "MEDIUM" ? "11%" : "9%",
                                                        transform: "translate(-50%, -50%)"
                                                    }
                                                    : {}
                                            }
                                            className={`rounded-lg flex flex-col items-center justify-center transition-transform hover:scale-105 duration-200 border shadow-sm cursor-pointer ${colorClass}`}
                                        >
                                            {/* Stall number */}
                                            <span className="font-bold text-sm md:text-base leading-none text-gray-700 pointer-events-none">
                                                {String(stall.stallCode.split("-")[1]).padStart(2, "0")}
                                            </span>

                                            {/* Price or SOLD */}
                                            {isReserved ? (
                                                <span className="text-[9px] font-bold mt-0.5 text-gray-500 uppercase tracking-widest pointer-events-none">SOLD</span>
                                            ) : (
                                                <span className="text-[9px] font-mono font-medium mt-0.5 text-gray-600 opacity-80 pointer-events-none">
                                                    {stall.price ? (stall.price / 1000).toFixed(0) + "k" : ""}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </HallShapeWrapper>
                </div>

                {/* ── Footer / Notice ── */}
                <div className="max-w-5xl mx-auto mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Confidential — For Internal Use Only.
                    </p>
                </div>

            </main>

            {/* ══════════════════════════════════════════
                 QR CODE MODAL
            ══════════════════════════════════════════ */}
            {qrModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.72)" }}
                    onClick={closeQrModal}
                >
                    <div
                        className="relative rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl"
                        style={{
                            background: "#1a3a3a",
                            border: "2px solid #2a6a6a",
                            boxShadow: "0 0 0 1px #0d2020, 0 16px 64px rgba(0,255,200,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                            minWidth: "360px",
                            fontFamily: "'Courier New', Courier, monospace"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeQrModal}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-teal-300 hover:text-white hover:bg-teal-700 transition-colors text-xl font-bold"
                            title="Close (Esc)"
                        >
                            ×
                        </button>

                        {/* Title */}
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-[0.2em] mb-1" style={{ color: "#6ab8b8" }}>Stall QR Code</p>
                            <h2 className="text-3xl font-extrabold" style={{ color: "#fff", textShadow: "0 2px 12px rgba(0,255,200,0.3)" }}>
                                {qrModal.stallCode}
                            </h2>
                        </div>

                        {/* Enlarged QR — 400×400 */}
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{
                                padding: "10px",
                                background: "#fff",
                                boxShadow: "0 0 0 3px #2fffbf40"
                            }}
                        >
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(
                                    `STALL:${qrModal.stallCode}|PRICE:${qrModal.price}|FLOOR:${qrModal.floor}`
                                )}`}
                                alt={`QR Code for ${qrModal.stallCode}`}
                                width={400}
                                height={400}
                                style={{ display: "block", imageRendering: "crisp-edges" }}
                            />
                        </div>

                        {/* Info strip beneath QR */}
                        <div className="flex gap-6 text-center">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest" style={{ color: "#6a9a9a" }}>PRICE</p>
                                <p className="text-sm font-bold" style={{ color: "#e8f5f5" }}>₱{(qrModal.price || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest" style={{ color: "#6a9a9a" }}>FLOOR</p>
                                <p className="text-sm font-bold" style={{ color: "#e8f5f5" }}>{qrModal.floor}</p>
                            </div>
                        </div>

                        <p className="text-[9px] text-center" style={{ color: "#3a7a7a" }}>
                            Click backdrop or press ESC to close
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeStallMap;
