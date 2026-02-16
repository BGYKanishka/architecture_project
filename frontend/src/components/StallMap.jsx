import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StallService from "../services/stall.service";
import HallMap from "./HallMap";
import HallShapeWrapper from "./HallShapeWrapper";

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
  "Hall B": [ // 8 Stalls (Octagon - Simple Ring)
    { top: "10%", left: "42%" }, // 1 (Top)
    { top: "20%", left: "70%" }, // 2 (Top Right)
    { top: "45%", left: "80%" }, // 3 (Right)
    { top: "70%", left: "70%" }, // 4 (Bottom Right)
    { top: "80%", left: "42%" }, // 5 (Bottom)
    { top: "70%", left: "15%" }, // 6 (Bottom Left)
    { top: "45%", left: "5%" },  // 7 (Left)
    { top: "20%", left: "15%" }, // 8 (Top Left)
  ],
  "Hall C": [ // 12 Stalls (Left Wing)
    { top: "10%", left: "40%" }, // C-01 (Large - Top)
    // Left Curve (Small Stalls)
    { top: "25%", left: "15%" }, { top: "40%", left: "10%" }, { top: "55%", left: "10%" }, { top: "70%", left: "15%" }, { top: "85%", left: "25%" },
    // Right Edge (Medium Stalls)
    { top: "25%", left: "65%" }, { top: "38%", left: "65%" }, { top: "51%", left: "65%" }, { top: "64%", left: "65%" }, { top: "77%", left: "65%" }, { top: "90%", left: "65%" }
  ],
  "Hall D": [ // 12 Stalls (Right Wing - Mirror of C)
    { top: "10%", left: "40%" }, // D-01 (Large - Top)
    // Right Curve (Small Stalls)
    { top: "25%", left: "70%" }, { top: "40%", left: "75%" }, { top: "55%", left: "75%" }, { top: "70%", left: "70%" }, { top: "85%", left: "60%" },
    // Left Edge (Medium Stalls)
    { top: "25%", left: "20%" }, { top: "38%", left: "20%" }, { top: "51%", left: "20%" }, { top: "64%", left: "20%" }, { top: "77%", left: "20%" }, { top: "90%", left: "20%" }
  ],
  "Hall E": [ // 5 Stalls (Large - Rectangle)
    // A simple "X" or "Dice 5" pattern
    { top: "20%", left: "20%" }, { top: "20%", left: "65%" },
    { top: "45%", left: "42%" }, // Center
    { top: "70%", left: "20%" }, { top: "70%", left: "65%" }
  ],
  "Hall F": [ // 15 Stalls (Rectangle - Grid 5x3)
    { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
    { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
    { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" },
  ],
  "Hall G": [ // 15 Stalls (Same layout as F)
    { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
    { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
    { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" },
  ]
};

const StallMap = () => {
  const navigate = useNavigate();
  const { hallName } = useParams();
  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState([]);

  const view = hallName ? "hall" : "map";
  const activeHall = hallName || null;

  useEffect(() => {
    StallService.getAllStalls().then((res) => {
      setStalls(res.data);
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
    if (stall.reserved) return;
    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) return alert("Max 3 stalls!");
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  const getSizeColor = (size, isReserved, isSelected) => {
    if (isReserved) return "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed";
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
            <button onClick={handleBackToMap} className="bg-white border px-4 py-2 rounded shadow-sm hover:bg-gray-50">
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
                  const colorClass = getSizeColor(stall.size, stall.reserved, isSelected);

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
                              width: stall.size === 'LARGE' ? "14%" : "10%", // Make Large stalls bigger
                              height: stall.size === 'LARGE' ? "14%" : "10%",
                              transform: "translate(-50%, -50%)" // Centers item on the coordinate
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

                      
                      {!stall.reserved && (
                        <span className="text-[10px] font-mono font-medium mt-1">
                          {stall.price / 1000}k
                        </span>
                      )}
                      
                      {stall.reserved && <span className="text-[8px] font-bold mt-1">SOLD</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </HallShapeWrapper>
          
          {selectedStalls.length > 0 && (
             <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-xl border flex gap-4 items-center z-50">
                 <span className="font-bold text-blue-900">{selectedStalls.length} Selected</span>
                 <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">Confirm</button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StallMap;