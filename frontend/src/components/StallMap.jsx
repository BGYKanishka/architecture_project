import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StallService from "../services/stall.service";
import HallMap from "./HallMap";
import HallShapeWrapper from "./HallShapeWrapper";
import ConfirmationModal from "./common/ConfirmationModal";

// Coordinate Maps for Visual Layout
const hallLayouts = {
  "Hall A": [ // 20 Stalls (Octagon)
    { top: "6%", left: "36%" }, // A-01 (Top)
    { top: "6%", left: "50%" }, { top: "6%", left: "64%" }, { top: "15%", left: "75%" }, { top: "35%", left: "93%" }, // Right Side
    { top: "50%", left: "93%" }, // A-06
    { top: "65%", left: "93%" }, { top: "80%", left: "77%" },//7,8
    { top: "80%", left: "23%" }, { top: "65%", left: "8%" }, // 9,10
    { top: "50%", left: "8%" }, { top: "35%", left: "8%" }, //11,12


    // Center Block
    { top: "35%", left: "36%" }, { top: "35%", left: "64%" },//13,14
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

const StallMap = () => {
  const navigate = useNavigate();
  const { hallName } = useParams();
  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [paidReservations, setPaidReservations] = useState(() => {
    const saved = localStorage.getItem("paidReservations");
    return saved ? JSON.parse(saved) : [];
  });
  const [cancelledReservations, setCancelledReservations] = useState(() => {
    const saved = localStorage.getItem("cancelledReservations");
    return saved ? JSON.parse(saved) : [];
  });
  const [reservationCount, setReservationCount] = useState(0);

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const showAlert = (title, message) => {
    setAlertConfig({ isOpen: true, title, message });
  };

  useEffect(() => {
    const fetchCount = () => {
      StallService.getReservationCount()
        .then((res) => {
          // console.log("Reservation count loaded:", res.data);
          setReservationCount(res.data);
        })
        .catch((err) => console.error("Error fetching reservation count:", err));
    };

    fetchCount();
    const intervalId = setInterval(fetchCount, 3000); // Poll count as well

    return () => clearInterval(intervalId);
  }, []);



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
    const fetchStalls = () => {
      StallService.getAllStalls()
        .then((res) => {
          // console.log("Stalls loaded:", res.data); // Debug log (Optional: remove to reduce noise)
          if (Array.isArray(res.data)) {
            setStalls(res.data);

            // Sync Local Storage with Backend
            const localPaid = JSON.parse(localStorage.getItem("paidReservations") || "[]");
            const validatedPaid = localPaid.filter((paidItem) => {
              const paidId = typeof paidItem === 'object' ? paidItem.id : paidItem;
              const stall = res.data.find((s) => s.id === paidId);
              if (stall && !stall.reserved) {
                return false;
              }
              return true;
            });

            if (validatedPaid.length !== localPaid.length) {
              console.warn("Found stale reservations in local storage. Cleaning up...", {
                before: localPaid,
                after: validatedPaid
              });
              localStorage.setItem("paidReservations", JSON.stringify(validatedPaid));
              setPaidReservations(validatedPaid);
              window.dispatchEvent(new Event("paidReservationsUpdated"));
            }

          } else {
            console.error("API returned non-array for stalls:", res.data);
            setStalls([]);
          }
        })
        .catch((err) => {
          console.error("Error loading stalls:", err);
          // Only clear stalls if it's a critical failure, otherwise keep old data
          // setStalls([]); 
        });
    };

    // Initial fetch
    fetchStalls();

    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchStalls, 3000);

    // Cleanup on unmount
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
      showAlert("Stall Unavailable", "This stall has been disabled by the administrator and cannot be booked.");
      return;
    }
    const isActuallyReserved = stall.reserved && !cancelledReservations.includes(stall.id);
    const isPaid = paidReservations.some(item => (typeof item === 'object' && item !== null ? item.id : item) === stall.id);
    if (isActuallyReserved || isPaid) return;

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

  const getSizeColor = (size, isReserved, isSelected, isPaid, isCancelled, isDisabled) => {
    if (isDisabled) return "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-60";
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

                {/* Render Doors */}
                {hallDoors[activeHall]?.map((door, idx) => (
                  <div
                    key={`door-${idx}`}
                    className="absolute px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded shadow-md border border-white z-40 hover:scale-110 transition-transform cursor-default"
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
                  const isPaid = paidReservations.some(item => (typeof item === 'object' && item !== null ? item.id : item) === stall.id);
                  const isCancelled = cancelledReservations.includes(stall.id);
                  const colorClass = getSizeColor(stall.size, stall.reserved, isSelected, isPaid, isCancelled, stall.disabled);

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
                        relative group rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 shadow-sm
                        ${colorClass}
                      `}
                    >
                      <span className="font-bold text-sm md:text-lg leading-none">
                        {stall.stallCode.split("-")[1]}
                      </span>
                      {!stall.reserved && !isPaid && !stall.disabled && (
                        <span className="text-[10px] font-mono font-medium mt-1">
                          {stall.price / 1000}k
                        </span>
                      )}
                      {stall.reserved && isCancelled && !stall.disabled && (
                        <span className="text-[10px] font-mono font-medium mt-1">
                          {stall.price / 1000}k
                        </span>
                      )}
                      {(stall.reserved && !isCancelled || isPaid) && !stall.disabled && <span className="text-[8px] font-bold mt-1">SOLD</span>}
                      {stall.disabled && <span className="text-[7px] font-bold mt-1 text-slate-500">DISABLED</span>}

                      {/* Tooltip */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center bg-gray-200 text-black text-[8px] sm:text-[10px] font-medium rounded py-0.5 px-1 whitespace-nowrap z-[100] shadow-sm">
                        {stall.size === "SMALL" ? "Small - 3m * 3m" : stall.size === "MEDIUM" ? "Medium- 5m* 5m" : "Large -7m * 7m"}
                      </div>
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