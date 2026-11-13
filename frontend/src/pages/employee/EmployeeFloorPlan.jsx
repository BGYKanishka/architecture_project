import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../../services/employee/service";
import HallMap from "../../components/HallMap";

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
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
            <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header info */}
                <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                            Staff Operations
                        </p>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Exhibition Hall Overview
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Click any hall block to inspect stall allocations and verify attendee tickets.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                            <span>Available: {availableCount}</span>
                        </div>
                        <span className="text-slate-700">|</span>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-slate-600"></span>
                            <span>Occupied: {reservedCount}</span>
                        </div>
                        {disabledCount > 0 && (
                            <>
                                <span className="text-slate-700">|</span>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700"></span>
                                    <span>Disabled: {disabledCount}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Map Area */}
                <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-6 sm:p-8">
                    {loading && (
                        <div className="text-center py-20 text-slate-500 text-xs">
                            Loading venue floor plan…
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-10 text-rose-400 text-xs">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <HallMap
                            getHallStatus={getHallStatus}
                            onHallClick={handleHallClick}
                        />
                    )}

                    <p className="text-center text-slate-500 text-xs mt-6">
                        Click on any exhibition wing to drill down into stall allocations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeFloorPlan;
