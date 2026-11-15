import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StallService from "../services/stall.service";
import HallMap from "./HallMap";
import HallShapeWrapper from "./HallShapeWrapper";
import ConfirmationModal from "./common/ConfirmationModal";

const hallLayouts = {
  "Hall A": [
    { top: "6%", left: "36%" },
    { top: "6%", left: "50%" }, { top: "6%", left: "64%" }, { top: "15%", left: "75%" }, { top: "35%", left: "93%" },
    { top: "50%", left: "93%" },
    { top: "65%", left: "93%" }, { top: "80%", left: "77%" },
    { top: "80%", left: "23%" }, { top: "65%", left: "8%" },
    { top: "50%", left: "8%" }, { top: "35%", left: "8%" },
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
    { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
    { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
    { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
  ]
};

const hallDoors = {
  "Hall A": [
    { label: "Entrance", top: "92%", left: "50%" },
    { label: "Exit", top: "15%", left: "23%" }
  ],
  "Hall B": [
    { label: "Entrance", top: "50%", left: "5%" },
    { label: "Exit", top: "50%", left: "95%" }
  ],
  "Hall C": [
    { label: "Entrance", top: "83%", left: "15%" },
    { label: "Exit", top: "5%", left: "50%" }
  ],
  "Hall D": [
    { label: "Entrance", top: "80%", left: "80%" },
    { label: "Exit", top: "5%", left: "50%" }
  ],
  "Hall E": [
    { label: "Entrance", top: "90%", left: "50%" },
    { label: "Exit", top: "50%", left: "95%" }
  ],
  "Hall F": [
    { label: "Entrance", top: "5%", left: "50%" },
    { label: "Exit", top: "95%", left: "50%" }
  ],
  "Hall G": [
    { label: "Entrance", top: "5%", left: "50%" },
    { label: "Exit", top: "95%", left: "50%" }
  ]
};

const POLL_INTERVAL_MS = 15000; // 15 seconds — avoids hammering the backend

const StallMap = () => {
  const navigate = useNavigate();
  const { hallName } = useParams();
  const [stalls, setStalls] = useState([]);
  const [myReservedIds, setMyReservedIds] = useState(new Set());
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [reservationCount, setReservationCount] = useState(0);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const showAlert = (title, message) => {
    setAlertConfig({ isOpen: true, title, message });
  };

  const view = hallName ? "hall" : "map";

  // Single polling loop — fetches stalls + reservation count together
  useEffect(() => {
    const fetchAll = () => {
      StallService.getAllStalls()
        .then((res) => { if (Array.isArray(res.data)) setStalls(res.data); })
        .catch((err) => console.error("Error loading stalls:", err));

      StallService.getReservationCount()
        .then((res) => setReservationCount(res.data))
        .catch((err) => console.error("Error fetching reservation count:", err));

      StallService.getMyReservations()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setMyReservedIds(new Set(res.data.map((r) => r.id)));
          }
        })
        .catch(() => {}); // best-effort; unauthenticated visitors get empty set
    };

    fetchAll();

    // Pause polling when the tab is hidden to reduce backend load
    const intervalId = setInterval(() => {
      if (!document.hidden) fetchAll();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
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
    navigate(`/map/${name}`);
  };

  const handleBackToMap = () => navigate("/map");

  const toggleSelection = (stall) => {
    if (stall.disabled) {
      showAlert("Stall Unavailable", "This stall has been disabled by the administrator.");
      return;
    }
    const isOccupied = stall.reserved || myReservedIds.has(stall.id);
    if (isOccupied) return;

    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length + reservationCount >= 3) {
        return showAlert(
          "Limit Reached",
          `You already have ${reservationCount} active reservations. Max allowed is 3.`
        );
      }
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  const getSizeColor = (size, isReserved, isSelected, isMine, isDisabled) => {
    if (isDisabled) return "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-40";
    if (isReserved || isMine) return "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed";
    if (isSelected) return "bg-indigo-600 border-indigo-400 text-white z-50 scale-105 shadow-md";

    switch (size) {
      case "SMALL": return "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 hover:border-emerald-400";
      case "MEDIUM": return "bg-cyan-950/80 border-cyan-500/80 text-cyan-300 hover:border-cyan-400";
      case "LARGE": return "bg-violet-950/80 border-violet-500/80 text-violet-300 hover:border-violet-400";
      default: return "bg-slate-900 border-slate-800 text-slate-300";
    }
  };

  const activeFloorStalls = hallName
    ? stalls
      .filter((s) => s.floorName === hallName.replace("Hall ", ""))
      .sort((a, b) => a.stallCode.localeCompare(b.stallCode))
    : [];

  const currentLayout = hallLayouts[hallName];

  const handleConfirmReservation = () => {
    if (selectedStalls.length + reservationCount > 3) {
      showAlert(
        "Limit Reached",
        `You already have ${reservationCount} active reservations. Max allowed is 3.`
      );
      return;
    }

    const selectedStallObjects = stalls.filter(stall =>
      selectedStalls.includes(stall.id)
    );

    navigate("/booking-summary", {
      state: { stalls: selectedStallObjects }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-[#0f1422] min-h-[600px] font-sans text-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          BMICH Exhibition Floor Plan
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Select an exhibition wing to view stall allocations and real-time availability
        </p>
      </div>

      {view === "map" && (
        <HallMap getHallStatus={getHallStatus} onHallClick={handleHallClick} />
      )}

      {view === "hall" && (
        <div className="max-w-6xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white">{hallName}</h2>
              <div className="flex gap-4 text-xs mt-1.5 text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Small (Rs 5k)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-sm"></span> Medium (Rs 7.5k)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-violet-500 rounded-sm"></span> Large (Rs 10k)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-700 rounded-sm"></span> Reserved</span>
              </div>
            </div>
            <button onClick={handleBackToMap} className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium px-4 py-2 rounded-lg text-xs transition">
              ← Back to Wing Overview
            </button>
          </div>

          <HallShapeWrapper key={hallName} hallName={hallName}>
            {activeFloorStalls.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500 text-xs">No stalls configured for this hall.</p>
              </div>
            ) : (
              <div key={hallName} className={`w-full h-full ${currentLayout ? 'relative' : 'grid grid-cols-4 gap-4 p-8'}`}>

                {/* Render Doors */}
                {hallDoors[hallName]?.map((door, idx) => (
                  <div
                    key={`door-${idx}`}
                    className="absolute px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-medium rounded shadow-sm z-30"
                    style={{
                      top: door.top,
                      left: door.left,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    {door.label}
                  </div>
                ))}

                {activeFloorStalls.map((stall, index) => {
                  const pos = currentLayout && currentLayout[index] ? currentLayout[index] : {};
                  const isSelected = selectedStalls.includes(stall.id);
                  const isMine = myReservedIds.has(stall.id);
                  const colorClass = getSizeColor(stall.size, stall.reserved, isSelected, isMine, stall.disabled);

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
                            width: stall.size === 'LARGE' ? "14%" : stall.size === 'MEDIUM' ? "12%" : "10%",
                            height: stall.size === 'LARGE' ? "14%" : stall.size === 'MEDIUM' ? "12%" : "10%",
                            transform: "translate(-50%, -50%)"
                          }
                          : {}
                      }
                      className={`
                        relative group rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors border ${colorClass}
                      `}
                    >
                      <span className="font-bold text-xs md:text-sm leading-none">
                        {stall.stallCode.split("-")[1]}
                      </span>
                      {!stall.reserved && !isMine && !stall.disabled && (
                        <span className="text-[9px] font-mono mt-0.5 opacity-90">
                          {stall.price / 1000}k
                        </span>
                      )}
                      {(stall.reserved || isMine) && !stall.disabled && (
                        <span className="text-[8px] font-semibold mt-0.5 text-slate-500">SOLD</span>
                      )}
                      {stall.disabled && (
                        <span className="text-[7px] font-semibold mt-0.5 text-slate-500">OFF</span>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center bg-slate-900 border border-slate-700 text-slate-200 text-[10px] font-medium rounded py-0.5 px-1.5 whitespace-nowrap z-50 shadow-md">
                        {stall.size === "SMALL" ? "Small (10x10)" : stall.size === "MEDIUM" ? "Medium (15x15)" : "Large (20x20)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </HallShapeWrapper>

          {selectedStalls.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0f1422] px-6 py-3 rounded-xl shadow-2xl border border-slate-700 flex gap-4 items-center z-50">
              <span className="font-semibold text-white text-xs">{selectedStalls.length} Selected Stalls</span>
              <button
                onClick={handleConfirmReservation}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-xs transition shadow-sm"
              >
                Continue to Booking
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="Got it"
        isAlert={true}
      />
    </div>
  );
};

export default StallMap;
