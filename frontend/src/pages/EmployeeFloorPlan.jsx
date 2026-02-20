import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employee/service";
import HallMap from "../components/HallMap";

const EmployeeFloorPlan = () => {
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


    const getHallStatus = useCallback((hallName) => {
        const letter = hallName.replace("Hall ", "");
        const hallStalls = stalls.filter(s => s.floorName === letter);
        if (hallStalls.length === 0) return "unknown";
        const allFull = hallStalls.every(s => s.reserved || s.disabled);
        return allFull ? "full" : "available";
    }, [stalls]);

    const handleHallClick = (hallName) => {
        navigate(`/employee/floor-plan/${encodeURIComponent(hallName)}`);
    };

    const totalStalls = stalls.length;
    const reservedCount = stalls.filter(s => s.reserved).length;
    const disabledCount = stalls.filter(s => s.disabled && !s.reserved).length;
    const availableCount = totalStalls - reservedCount - disabledCount;

    return (
        <div style={{ minHeight: "100vh", background: "#EFF2F7", fontFamily: "'Inter', 'Helvetica Neue', 'Segoe UI', sans-serif" }}>

      
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
                            {disabledCount > 0 && (
                                <>
                                    {" | "}
                                    <span style={{ color: "#64748B", fontWeight: 700 }}>Disabled: {disabledCount}</span>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Map Area ── */}
            <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>



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
