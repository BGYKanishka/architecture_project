import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import employeeService from "../services/employee/service";
import HallMap from "../components/HallMap";

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
        <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

            {/* ── Top Navbar ── */}
            <header style={{
                background: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 100%)",
                color: "white",
                padding: "0 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "68px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "11px",
                        letterSpacing: "2px",
                        fontWeight: 700,
                        color: "#90caf9"
                    }}>
                        EMPLOYEE PORTAL
                    </div>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.5px" }}>CIBF 2026</div>
                        <div style={{ fontSize: "11px", color: "#90caf9", letterSpacing: "1px" }}>Colombo International Book Fair</div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    {user && (
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>{user.email}</div>
                            <div style={{ fontSize: "11px", color: "#90caf9" }}>🟢 Employee</div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.4)",
                            color: "#fca5a5",
                            padding: "8px 18px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.3)"}
                        onMouseLeave={e => e.target.style.background = "rgba(239,68,68,0.15)"}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ── Page Title ── */}
            <div style={{
                textAlign: "center",
                padding: "2.5rem 2rem 1rem",
                background: "linear-gradient(180deg, #0a1628 0%, #1a3a5c 60%, #f0f4f8 100%)",
            }}>
                <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: 900,
                    color: "white",
                    letterSpacing: "4px",
                    margin: 0,
                    textShadow: "0 2px 20px rgba(0,0,0,0.5)"
                }}>
                    CIBF 2026
                </h1>
                <h2 style={{
                    fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
                    fontWeight: 600,
                    color: "#90caf9",
                    letterSpacing: "6px",
                    margin: "0.4rem 0 0",
                    textTransform: "uppercase"
                }}>
                    BOOK FAIR FLOOR PLAN
                </h2>

                {/* ── Legend ── */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2rem",
                    marginTop: "1.5rem",
                    background: "white",
                    padding: "10px 28px",
                    borderRadius: "50px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
                }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "default", userSelect: "none" }}>
                        <input
                            type="checkbox"
                            checked={false}
                            readOnly
                            style={{
                                width: "16px", height: "16px",
                                accentColor: "#22c55e",
                                cursor: "default"
                            }}
                        />
                        <span style={{
                            fontSize: "13px", fontWeight: 700, color: "#16a34a",
                            display: "flex", alignItems: "center", gap: "5px"
                        }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
                            Available
                        </span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "default", userSelect: "none" }}>
                        <input
                            type="checkbox"
                            checked={true}
                            readOnly
                            style={{
                                width: "16px", height: "16px",
                                accentColor: "#6b7280",
                                cursor: "default"
                            }}
                        />
                        <span style={{
                            fontSize: "13px", fontWeight: 700, color: "#4b5563",
                            display: "flex", alignItems: "center", gap: "5px"
                        }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#9ca3af", display: "inline-block" }}></span>
                            Full
                        </span>
                    </label>
                </div>

                {/* ── Summary Stats ── */}
                {!loading && !error && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
                        {[
                            { label: "Total Stalls", value: totalStalls, color: "#90caf9" },
                            { label: "Available", value: availableCount, color: "#4ade80" },
                            { label: "Reserved", value: reservedCount, color: "#f87171" },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "12px",
                                padding: "10px 22px",
                                textAlign: "center",
                                color: "white"
                            }}>
                                <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: "11px", letterSpacing: "1px", opacity: 0.8 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}
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
