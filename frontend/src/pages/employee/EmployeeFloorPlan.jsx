import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import employeeService from "../../services/employee/service";
import HallMap from "../../components/shared/HallMap";

const EmployeeFloorPlan = () => {
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = AuthService.getCurrentUser();

    useEffect(() => {
        employeeService.getEmployeeStalls()
            .then((res) => {
                setStalls(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load stalls:", err);
                setError("Failed to load stall data. Please try again.");
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/employee/login");
    };

    /**
     * Compute per-hall status for the HallMap component.
     * "available"  → at least one stall is not reserved
     * "full"       → all stalls are reserved
     * "unknown"    → no stalls found for this hall
     */
    const getHallStatus = useCallback((hallName) => {
        const letter = hallName.replace("Hall ", "");
        const hallStalls = stalls.filter(s => s.floorName === letter);
        if (hallStalls.length === 0) return "unknown";
        const allFull = hallStalls.every(s => s.reserved);
        return allFull ? "full" : "available";
    }, [stalls]);

    const handleHallClick = (hallName) => {
        navigate(`/employee/floor-plan/${encodeURIComponent(hallName)}`);
    };

    /* ---------- Summary counts ---------- */
    const totalStalls = stalls.length;
    const reservedCount = stalls.filter(s => s.reserved).length;
    const availableCount = totalStalls - reservedCount;

    return (
        <div style={{ minHeight: "100vh", background: "#EFF2F7", fontFamily: "'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif" }}>

            {/* ══════════════════════════════════════════════════════
                 TOP NAVBAR  — matches Header.jsx style
            ══════════════════════════════════════════════════════ */}
            <nav style={{
                background: "#ffffff",
                borderBottom: "1px solid #E5E7EB",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                padding: "0 1.5rem",
                height: "58px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}>

                {/* LEFT — hamburger + logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Hamburger */}
                    <button style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "6px", borderRadius: "8px", color: "#6B7280",
                        display: "flex", alignItems: "center"
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>

                    {/* Book icon + CIBF 2026 */}
                    <div style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}
                        onClick={() => navigate("/employee/floor-plan")}
                    >
                        <div style={{
                            background: "#1D4ED8",
                            borderRadius: "8px",
                            width: "34px", height: "34px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                            </svg>
                        </div>
                        <span style={{
                            fontSize: "18px", fontWeight: 800, color: "#111827", letterSpacing: "-0.3px"
                        }}>CIBF <span style={{ color: "#1D4ED8" }}>2026</span></span>
                    </div>
                </div>

                {/* RIGHT — icon buttons + My Reservations + user avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

                    {/* Home icon */}
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "50%", color: "#6B7280", display: "flex" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                        onClick={() => navigate("/employee/floor-plan")}
                        title="Floor Plan"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </button>

                    {/* Bell icon */}
                    <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "50%", color: "#6B7280", display: "flex", position: "relative" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                        title="Notifications"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                        <span style={{ position: "absolute", top: "8px", right: "8px", width: "7px", height: "7px", background: "#EF4444", borderRadius: "50%", border: "2px solid white" }}></span>
                    </button>

                    {/* Separator */}
                    <div style={{ width: "1px", height: "22px", background: "#E5E7EB", margin: "0 4px" }} />

                    {/* My Reservations */}
                    <button style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "7px 12px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: 600, color: "#374151",
                        transition: "background 0.15s"
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                        onClick={() => navigate("/reservations")}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        My Reservations
                    </button>

                    {/* User avatar circle */}
                    <button style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "#1D4ED8", border: "none", cursor: "pointer",
                        color: "white", fontWeight: 700, fontSize: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginLeft: "4px"
                    }}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        {user?.email?.charAt(0).toUpperCase() || "E"}
                    </button>
                </div>
            </nav>

            {/* ══════════════════════════════════════════════════════
                 SUB-HEADER  — page title + indicators card
            ══════════════════════════════════════════════════════ */}
            <div style={{ padding: "1.5rem 2rem 0", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                    padding: "1.25rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "1.5rem"
                }}>
                    {/* Page title */}
                    <h1 style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "#1E3A8A",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase"
                    }}>
                        Book Fair Floor Plan — Employee
                    </h1>

                    {/* Available / Full indicators */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "999px",
                        padding: "5px 18px"
                    }}>
                        {/* Green checkbox square — Available */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                                width: "14px", height: "14px",
                                borderRadius: "3px",
                                background: "#22C55E",
                                border: "1.5px solid #16A34A",
                                flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7.5 8,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Available</span>
                        </div>

                        {/* Divider dot */}
                        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#D1D5DB", margin: "0 4px" }} />

                        {/* Gray checkbox square — Full */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                                width: "14px", height: "14px",
                                borderRadius: "3px",
                                background: "#E5E7EB",
                                border: "1.5px solid #9CA3AF",
                                flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7.5 8,2.5" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Full</span>
                        </div>
                    </div>

                    {/* Live stall counts */}
                    {!loading && !error && (
                        <p style={{ margin: 0, fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>
                            <span style={{ color: "#6B7280" }}>{totalStalls} Total stalls</span>
                            {" | "}
                            <span style={{ color: "#16A34A", fontWeight: 700 }}>Available: {availableCount}</span>
                            {" | "}
                            <span style={{ color: "#DC2626", fontWeight: 700 }}>Full: {reservedCount}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* ── Map Area ── */}
            <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>

                {/* View-only notice */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "#eff6ff", border: "1px solid #bfdbfe",
                    borderRadius: "10px", padding: "10px 18px",
                    marginBottom: "1.5rem", color: "#1e40af", fontSize: "13px"
                }}>
                    <span>🔍</span>
                    <span><strong>View-only mode.</strong> Click any hall to see individual stall availability. Booking and purchasing are not available in this portal.</span>
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "5rem 0", color: "#64748b" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
                        <p style={{ fontSize: "16px", fontWeight: 500 }}>Loading floor plan…</p>
                    </div>
                )}

                {error && (
                    <div style={{
                        textAlign: "center", padding: "3rem",
                        background: "#fef2f2", border: "1px solid #fecaca",
                        borderRadius: "12px", color: "#dc2626"
                    }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div>
                        <p style={{ fontWeight: 600 }}>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <HallMap
                        getHallStatus={getHallStatus}
                        onHallClick={handleHallClick}
                    />
                )}

                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "2rem" }}>
                    Click on any hall to view individual stall details and availability status.
                </p>
            </div>
        </div>
    );
};

export default EmployeeFloorPlan;
