import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employee/service";
import HallShapeWrapper from "./HallShapeWrapper";

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
        { label: "Entrance", top: "5%", left: "50%" },
        { label: "Exit", top: "95%", left: "50%" }
    ]
};

const getSizeColor = (size, isReserved, isDisabled) => {
    if (isDisabled) return "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50";
    if (isReserved) return "bg-slate-900/90 border-slate-700/80 text-slate-500 cursor-default";
    switch (size) {
        case "SMALL": return "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 cursor-default";
        case "MEDIUM": return "bg-cyan-950/80 border-cyan-500/80 text-cyan-300 cursor-default";
        case "LARGE": return "bg-violet-950/80 border-violet-500/80 text-violet-300 cursor-default";
        default: return "bg-slate-800 border-slate-700 text-slate-300 cursor-default";
    }
};

const EmployeeStallMap = ({ hallName }) => {
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [hoveredStall, setHoveredStall] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

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
    const halls = ["Hall A", "Hall B", "Hall C", "Hall D", "Hall E", "Hall F", "Hall G"];

    const fetchStallDetails = (stallId) => {
        return employeeService.getStallDetails(stallId)
            .then(res => res.data)
            .catch(() => null);
    };

    const handleMouseEnter = (e, stall) => {
        const rect = e.currentTarget.getBoundingClientRect();
        let leftPos = rect.right + 10;
        if (leftPos + 320 > window.innerWidth) {
            leftPos = rect.left - 330;
        }

        setHoverPosition({
            x: leftPos,
            y: Math.max(10, rect.top - 20)
        });

        setHoveredStall({ ...stall, isLoading: true });

        fetchStallDetails(stall.stallId || stall.id).then((details) => {
            if (details) {
                setHoveredStall(prev => (prev && (prev.id === details.stallId || prev.stallId === details.stallId)
                    ? { ...details, isLoading: false }
                    : prev));
            }
        });
    };

    const handleMouseLeave = () => {
        setHoveredStall(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-[#0b0f19] text-slate-400 text-xs">
            Loading stalls...
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-[#0b0f19] text-rose-400 text-xs">
            {error}
        </div>
    );

    const getStatusStyle = (stall) => {
        if (!stall) return {};
        if (stall.disabled) return { label: "Disabled", color: "text-slate-500", dot: "bg-slate-500" };
        const ps = stall.paymentStatus;
        if (ps === "PAID" || stall.reserved) {
            return { label: "Occupied", color: "text-emerald-400", dot: "bg-emerald-400" };
        }
        return { label: "Available", color: "text-emerald-400", dot: "bg-emerald-400" };
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
            <div className="flex flex-1 overflow-hidden relative">
                {/* Hover Card Overlay */}
                {hoveredStall && (
                    <div
                        className="fixed z-50 pointer-events-none"
                        style={{ top: hoverPosition.y, left: hoverPosition.x }}
                    >
                        {hoveredStall.isLoading ? (
                            <div className="bg-[#0f1422] border border-slate-800 rounded-xl p-4 w-[280px] text-xs text-slate-400">
                                Fetching details…
                            </div>
                        ) : (() => {
                            const status = getStatusStyle(hoveredStall);
                            return (
                                <div className="w-[300px] bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl p-4 select-none space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Stall</p>
                                            <p className="text-lg font-bold text-white">{hoveredStall.stallCode}</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                            <span>{status.label}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <p className="text-slate-400 text-[11px]">Publisher</p>
                                            <p className="font-medium text-white">{hoveredStall.vendorName || "Unassigned"}</p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                                            <span className="text-slate-400 text-[11px]">Category: <strong className="text-slate-200">{hoveredStall.stallSize || hoveredStall.size}</strong></span>
                                            <span className="text-slate-200 font-semibold">LKR {(hoveredStall.price || 0).toLocaleString()}</span>
                                        </div>

                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Sidebar Navigation */}
                <aside className="w-52 bg-[#0f1422] border-r border-slate-800 flex flex-col z-20 shrink-0">
                    <div className="p-4 border-b border-slate-800">
                        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                            Wings
                        </h2>
                    </div>

                    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                        {halls.map((hall) => (
                            <button
                                key={hall}
                                onClick={() => navigate(`/employee/floor-plan/${encodeURIComponent(hall)}`)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                                    hallName === hall
                                        ? "bg-slate-800 text-white font-semibold"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }`}
                            >
                                {hall}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#0b0f19] p-6 sm:p-8 flex flex-col items-center">
                    <div className="w-full max-w-5xl flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">{hallName} — Stall Allocation</h1>
                            <div className="flex gap-4 text-xs mt-1 text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-emerald-500"></span> Small
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-cyan-500"></span> Medium
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-violet-500"></span> Large
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-slate-700"></span> Occupied
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/employee/floor-plan")}
                            className="text-xs text-slate-300 hover:text-white border border-slate-800 bg-[#0f1422] px-3 py-1.5 rounded-lg transition"
                        >
                            ← Back to Overview
                        </button>
                    </div>

                    {/* Hall Shape Canvas */}
                    <div className="w-full max-w-5xl bg-[#0f1422] rounded-xl border border-slate-800 p-6 min-h-[580px] flex items-center justify-center relative shadow-lg">
                        <HallShapeWrapper key={hallName} hallName={hallName}>
                            {activeFloorStalls.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                    <p className="text-xs">No stalls configured for {hallName}.</p>
                                </div>
                            ) : (
                                <div key={hallName} className="w-full h-full relative">
                                    {hallDoors[hallName]?.map((door, idx) => (
                                        <div
                                            key={`door-${idx}`}
                                            className={`absolute flex items-center justify-center font-bold text-white z-10 
                                                ${door.label.length <= 2 ? "w-7 h-7 rounded-full bg-indigo-600 text-xs" : "px-2.5 py-0.5 rounded bg-emerald-600 text-[10px]"}
                                            `}
                                            style={{ top: door.top, left: door.left, transform: "translate(-50%, -50%)" }}
                                            title={door.label}
                                        >
                                            {door.label}
                                        </div>
                                    ))}

                                    {activeFloorStalls.map((stall, index) => {
                                        const pos = currentLayout && currentLayout[index] ? currentLayout[index] : {};
                                        const isReserved = stall.reserved;
                                        const isDisabled = stall.disabled;
                                        const colorClass = getSizeColor(stall.stallSize || stall.size, isReserved, isDisabled);

                                        return (
                                            <div
                                                key={stall.stallId || stall.id}
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
                                                className={`rounded-lg flex flex-col items-center justify-center transition-colors border cursor-pointer ${colorClass}`}
                                            >
                                                <span className="font-bold text-xs md:text-sm leading-none pointer-events-none">
                                                    {stall.stallCode?.includes("-")
                                                        ? String(stall.stallCode.split("-")[1]).padStart(2, "0")
                                                        : stall.stallCode || ""}
                                                </span>
                                                {isDisabled ? (
                                                    <span className="text-[7px] font-bold mt-0.5 text-slate-500 tracking-wider pointer-events-none">OFF</span>
                                                ) : isReserved ? (
                                                    <span className="text-[8px] font-bold mt-0.5 text-slate-500 uppercase tracking-wider pointer-events-none">SOLD</span>
                                                ) : (
                                                    <span className="text-[8px] font-mono font-medium mt-0.5 opacity-90 pointer-events-none">
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
                </main>
            </div>
        </div>
    );
};

export default EmployeeStallMap;
