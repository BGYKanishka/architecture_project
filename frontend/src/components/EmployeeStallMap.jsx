import { useEffect, useState } from "react";
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

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-gray-500 font-medium text-lg">
            <span>Loading stalls...</span>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen text-red-500 font-medium text-lg">{error}</div>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden relative">
            {/* ── Hover Card Overlay ── */}
            {hoveredStall && (
                <div
                    className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 w-80 animate-fade-in pointer-events-none"
                    style={{ top: hoverPosition.y, left: hoverPosition.x }}
                >
                    {hoveredStall.isLoading ? (
                        <div className="flex items-center justify-center py-6 space-x-2 text-gray-400">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Fetching details...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Header: Code & Status */}
                            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                                <div>
                                    <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">{hoveredStall.stallCode}</h3>
                                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${hoveredStall.reserved ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                        {hoveredStall.reserved ? "Occupied" : "Available"}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-gray-400 uppercase font-semibold">Price</span>
                                    <span className="font-mono font-bold text-lg text-blue-600">₹{hoveredStall.price}</span>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="bg-gray-50 p-2 rounded">
                                    <span className="block text-gray-400 text-[10px] uppercase">Size</span>
                                    <span className="font-semibold">{hoveredStall.stallSize || hoveredStall.size}</span>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <span className="block text-gray-400 text-[10px] uppercase">Floor</span>
                                    <span className="font-semibold">{hoveredStall.floorName}</span>
                                </div>
                            </div>

                            {/* Booking Details (Conditional) */}
                            {hoveredStall.reserved && (
                                <div className="mt-3 pt-2 border-t border-gray-100 animate-fade-in">
                                    <div className="flex gap-4">
                                        {/* QR Code */}
                                        {hoveredStall.qrCodeData && (
                                            <div className="shrink-0 bg-white p-1 border border-gray-200 rounded-lg shadow-sm">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(hoveredStall.qrCodeData)}`}
                                                    alt="Booking QR"
                                                    className="w-20 h-20 object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* Vendor Info */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Booked By</p>
                                                <p className="text-sm font-bold text-gray-800 truncate">{hoveredStall.vendorName || "Unknown"}</p>
                                                {hoveredStall.businessName && <p className="text-xs text-gray-600 truncate">{hoveredStall.businessName}</p>}
                                            </div>

                                            <div className="pt-1">
                                                <p className="flex items-center gap-1 text-[11px] text-gray-500">
                                                    <span>📧</span> <span className="truncate">{hoveredStall.vendorEmail}</span>
                                                </p>
                                                <p className="flex items-center gap-1 text-[11px] text-gray-500">
                                                    <span>📞</span> <span>{hoveredStall.vendorContact}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Status Badge */}
                                    <div className="mt-2 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${hoveredStall.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                                                hoveredStall.paymentStatus === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                            }`}>
                                            Payment: {hoveredStall.paymentStatus || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
        </div>
    );
};

export default EmployeeStallMap;
