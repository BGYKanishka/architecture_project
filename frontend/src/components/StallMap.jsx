import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StallService from "../services/stall.service";
import HallMap from "./HallMap";

const StallMap = () => {
  const navigate = useNavigate();
  const { hallName } = useParams();

  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState([]);

  const view = hallName ? "hall" : "map";
  const activeHall = hallName || null;

  useEffect(() => {
    StallService.getAllStalls()
      .then((res) => setStalls(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getHallStatus = (hallName) => {
    if (hallName === "Main Building") return "info";
    const hallStalls = stalls.filter((s) => s.location === hallName);
    if (hallStalls.length === 0) return "available";

    const hasAvailable = hallStalls.some((s) => !s.reserved);
    return hasAvailable ? "available" : "full";
  };

  const handleHallClick = (name) => {
    if (name === "Main Building") return;
    navigate(`/dashboard/${name}`);
  };

  const handleBackToMap = (e) => {
    if (e) e.preventDefault();
    navigate("/dashboard");
  };

  const toggleSelection = (stall) => {
    if (stall.reserved) return;
    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) return alert("Max 3 stalls!");
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-2 tracking-widest uppercase">
        Book Fair Floor Plan
      </h1>

      <p className="text-center text-gray-600 mb-6 font-medium animate-pulse">
        {view === "map" ? " Click on a Hall to view available stalls" : `Displaying stalls for ${activeHall}`}
      </p>

      {view === "map" && (
        <HallMap getHallStatus={getHallStatus} onHallClick={handleHallClick} />
      )}

      {/* ZOOMED VIEW */}

      {view === "hall" && (

        <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in">

          <div className="flex justify-between items-center mb-8 border-b pb-4">

            <div>

              <h2 className="text-3xl font-bold text-gray-800">Booking: {activeHall}</h2>

              <p className="text-gray-500 mt-1">Select your preferred stalls below.</p>

            </div>
            <button
              type="button"
              onClick={handleBackToMap}
              className="bg-blue-600 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition flex items-center gap-2 shadow-md active:scale-95"
            >
              <span></span> Back to Map
            </button>
          </div>

          {/* Filtering stalls by the location (Hall Name) */}

          {stalls.filter(s => s.location === activeHall).length === 0 ? (

            <div className="text-center py-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">

              <p className="text-xl text-gray-400 font-medium">No stalls found for {activeHall}.</p>

              <p className="text-sm text-gray-400">Please check your database population script.</p>

            </div>

          ) : (

            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">

              {stalls.filter(s => s.location === activeHall).map(stall => (

                <div key={stall.id}

                  onClick={() => toggleSelection(stall)}

                  className={`h-28 border-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden

                          ${stall.reserved ? 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed'

                      : selectedStalls.includes(stall.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105 z-10'

                        : 'bg-white border-green-200 text-green-800 hover:border-green-500 hover:shadow-md'}`}

                >

                  <span className="font-bold text-lg z-10">{stall.stallCode}</span>

                  <span className={`text-xs font-medium mt-1 z-10 ${selectedStalls.includes(stall.id) ? 'text-blue-100' : 'text-gray-500'}`}>${stall.price}</span>



                  {stall.reserved && (

                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 z-20">

                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm rotate-[-15deg]">SOLD</span>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}



          {selectedStalls.length > 0 && (

            <div className="mt-8 bg-blue-50 p-6 rounded-xl flex justify-between items-center border border-blue-100">

              <div>

                <span className="block text-sm text-blue-600 font-bold uppercase tracking-wider">Selected Stalls</span>

                <span className="text-2xl font-bold text-blue-900">{selectedStalls.length} Stalls</span>

              </div>

              <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1">

                Confirm Reservation

              </button>

            </div>

          )}

        </div>

      )}

    </div>

  );
};

export default StallMap;
