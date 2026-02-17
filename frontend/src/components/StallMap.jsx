import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StallService from "../services/stall.service";
import HallMap from "./HallMap";
import HallShapeWrapper from "./HallShapeWrapper";

// Coordinate Maps for Visual Layout
const hallLayouts = {
  "Hall A": [ // 20 Stalls (Octagon)
    { top: "5%", left: "45%" }, // A-01 (Top)
    { top: "15%", left: "70%" }, { top: "30%", left: "85%" }, { top: "55%", left: "85%" }, { top: "75%", left: "70%" }, // Right Side
    { top: "85%", left: "45%" }, // Bottom
    { top: "75%", left: "20%" }, { top: "55%", left: "5%" }, { top: "30%", left: "5%" }, { top: "15%", left: "20%" }, // Left Side
    // Inner Ring
    { top: "25%", left: "30%" }, { top: "25%", left: "60%" },
    { top: "45%", left: "25%" }, { top: "45%", left: "65%" },
    { top: "65%", left: "30%" }, { top: "65%", left: "60%" },
    // Center Block
    { top: "35%", left: "45%" }, { top: "45%", left: "45%" }, { top: "55%", left: "45%" }, { top: "45%", left: "35%" }
  ],
  "Hall B": [
    { top: "10%", left: "42%" }, { top: "20%", left: "70%" }, { top: "45%", left: "80%" }, { top: "70%", left: "70%" },
    { top: "80%", left: "42%" }, { top: "70%", left: "15%" }, { top: "45%", left: "5%" }, { top: "20%", left: "15%" }
  ],
  "Hall C": [
    { top: "10%", left: "40%" },
    { top: "25%", left: "15%" }, { top: "40%", left: "10%" }, { top: "55%", left: "10%" }, { top: "70%", left: "15%" }, { top: "85%", left: "25%" },
    { top: "25%", left: "65%" }, { top: "38%", left: "65%" }, { top: "51%", left: "65%" }, { top: "64%", left: "65%" }, { top: "77%", left: "65%" }, { top: "90%", left: "65%" }
  ],
  "Hall D": [
    { top: "10%", left: "40%" },
    { top: "25%", left: "70%" }, { top: "40%", left: "75%" }, { top: "55%", left: "75%" }, { top: "70%", left: "70%" }, { top: "85%", left: "60%" },
    { top: "25%", left: "20%" }, { top: "38%", left: "20%" }, { top: "51%", left: "20%" }, { top: "64%", left: "20%" }, { top: "77%", left: "20%" }, { top: "90%", left: "20%" }
  ],
  "Hall E": [
    { top: "20%", left: "20%" }, { top: "20%", left: "65%" }, { top: "45%", left: "42%" }, { top: "70%", left: "20%" }, { top: "70%", left: "65%" }
  ],
  "Hall F": [
    { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
    { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
    { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
  ],
  "Hall G": [
    { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
    { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
    { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
  ]
};

const StallMap = () => {
  const navigate = useNavigate();
  const { hallName } = useParams();
  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState(() => {
    const saved = localStorage.getItem("selectedStalls");
    return saved ? JSON.parse(saved) : [];
  });
  const [paidReservations, setPaidReservations] = useState(() => {
    const saved = localStorage.getItem("paidReservations");
    return saved ? JSON.parse(saved) : [];
  });
  const [cancelledReservations, setCancelledReservations] = useState(() => {
    const saved = localStorage.getItem("cancelledReservations");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("selectedStalls", JSON.stringify(selectedStalls));
    window.dispatchEvent(new Event("selectedStallsUpdated"));
  }, [selectedStalls]);

  useEffect(() => {
    const syncStates = () => {
      setPaidReservations(JSON.parse(localStorage.getItem("paidReservations") || "[]"));
      setCancelledReservations(JSON.parse(localStorage.getItem("cancelledReservations") || "[]"));
    };
    window.addEventListener("paidReservationsUpdated", syncStates);
    window.addEventListener("cancelledReservationsUpdated", syncStates);
    return () => {
      window.removeEventListener("paidReservationsUpdated", syncStates);
      window.removeEventListener("cancelledReservationsUpdated", syncStates);
    };
  }, []);

  const view = hallName ? "hall" : "map";
  const activeHall = hallName || null;

  useEffect(() => {
    StallService.getAllStalls()
      .then((res) => {
        setStalls(res.data);
      })
      .catch((err) => {
        console.error("Error loading stalls:", err);
        // Optional: Alert user if backend is down
        // alert("Could not load stalls. Is the backend running?");
      });
  }, []);

  const getHallStatus = (visualHallName) => {
    if (visualHallName === "Main Building") return "info";
    const dbFloorName = visualHallName.replace("Hall ", "");
    const hallStalls = stalls.filter((s) => s.floorName === dbFloorName);
    if (hallStalls.length === 0) return "full";
    const hasAvailable = hallStalls.some((s) => !s.reserved);
    return hasAvailable ? "available" : "full";
  };

  const handleHallClick = (name) => {
    if (name === "Main Building") return;
    navigate(`/dashboard/${name}`);
  };

  const handleBackToMap = () => navigate("/dashboard");

  const toggleSelection = (stall) => {
    const isActuallyReserved = stall.reserved && !cancelledReservations.includes(stall.id);
    if (isActuallyReserved || paidReservations.includes(stall.id)) return;

    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) return alert("Max 3 stalls!");
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  const getSizeColor = (size, isReserved, isSelected, isPaid, isCancelled) => {
    const isActuallyReserved = isReserved && !isCancelled;
    if (isActuallyReserved || isPaid) return "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed";
    if (isSelected) return "bg-blue-600 border-blue-800 text-white shadow-xl z-50 scale-110";

    switch (size) {
      case "SMALL": return "bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200";
      case "MEDIUM": return "bg-cyan-100 border-cyan-400 text-cyan-800 hover:bg-cyan-200";
      case "LARGE": return "bg-violet-100 border-violet-400 text-violet-800 hover:bg-violet-200";
      default: return "bg-white border-gray-300";
    }
  };

  const activeFloorStalls = activeHall
    ? stalls
      .filter((s) => s.floorName === activeHall.replace("Hall ", ""))
      .sort((a, b) => a.stallCode.localeCompare(b.stallCode))
    : [];

  const currentLayout = hallLayouts[activeHall];

  // --- CONFIRM HANDLER ---
  const handleConfirmReservation = () => {
    // 1. Get full objects of selected IDs
    const selectedStallObjects = stalls.filter(stall =>
      selectedStalls.includes(stall.id)
    );

    // 2. Navigate to Summary Page
    navigate("/booking-summary", {
      state: { stalls: selectedStallObjects }
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-2 uppercase">
        Book Fair Floor Plan
      </h1>

      {view === "map" && (
        <HallMap getHallStatus={getHallStatus} onHallClick={handleHallClick} />
      )}

      {view === "hall" && (
        <div className="max-w-6xl mx-auto">
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{activeHall} Booking</h2>
              <div className="flex gap-3 text-xs mt-1">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-100 border border-emerald-400"></div> Small</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-100 border border-cyan-400"></div> Medium</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-violet-100 border border-violet-400"></div> Large</span>
              </div>
            </div>
            <button onClick={handleBackToMap} className="bg-blue-600 text-white font-bold rounded-full border px-4 py-2 rounded shadow-sm hover:bg-blue-800">
              Back to Map
            </button>
          </div>

          <HallShapeWrapper hallName={activeHall}>
            {activeFloorStalls.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No stalls found.</p>
              </div>
            ) : (
              <div className={`w-full h-full ${currentLayout ? 'relative' : 'grid grid-cols-4 gap-4 p-10'}`}>

                {activeFloorStalls.map((stall, index) => {
                  const pos = currentLayout && currentLayout[index] ? currentLayout[index] : {};
                  const isSelected = selectedStalls.includes(stall.id);
                  const isPaid = paidReservations.includes(stall.id);
                  const isCancelled = cancelledReservations.includes(stall.id);
                  const colorClass = getSizeColor(stall.size, stall.reserved, isSelected, isPaid, isCancelled);

                  return (
                    <div
                      key={stall.id}
                      onClick={() => toggleSelection(stall)}
                      style={
                        currentLayout
                          ? {
                            position: "absolute",
                            top: pos.top,
                            left: pos.left,
                            width: stall.size === 'LARGE' ? "14%" : "10%",
                            height: stall.size === 'LARGE' ? "14%" : "10%",
                            transform: "translate(-50%, -50%)"
                          }
                          : {}
                      }
                      className={`
                        rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 shadow-sm
                        ${colorClass}
                      `}
                    >
                      <span className="font-bold text-sm md:text-lg leading-none">
                        {stall.stallCode.split("-")[1]}
                      </span>
                      {!stall.reserved && !isPaid && (
                        <span className="text-[10px] font-mono font-medium mt-1">
                          {stall.price / 1000}k
                        </span>
                      )}
                      {stall.reserved && isCancelled && (
                        <span className="text-[10px] font-mono font-medium mt-1">
                          {stall.price / 1000}k
                        </span>
                      )}
                      {(stall.reserved && !isCancelled || isPaid) && <span className="text-[8px] font-bold mt-1">SOLD</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </HallShapeWrapper>

          {selectedStalls.length > 0 && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-xl border flex gap-4 items-center z-50">
              <span className="font-bold text-blue-900">{selectedStalls.length} Selected</span>
              <button
                onClick={handleConfirmReservation}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StallMap;