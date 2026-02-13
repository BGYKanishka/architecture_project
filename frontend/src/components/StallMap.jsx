import { useEffect, useState } from "react";
import StallService from "../services/stall.service";

const StallMap = () => {
  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = () => {
    StallService.getAllStalls()
      .then((res) => {
        setStalls(res.data);
      })
      .catch((err) => console.error("Error loading stalls", err));
  };

  const toggleSelection = (stall) => {
    if (stall.reserved) return; // Cannot select booked stalls

    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) {
        alert("You can only select up to 3 stalls!");
        return;
      }
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  const handleReservation = () => {
    StallService.reserveStalls(selectedStalls)
      .then((res) => {
        setMessage("Reservation Successful! Check your email.");
        setSelectedStalls([]);
        loadStalls(); // Refresh map to show red boxes
      })
      .catch((err) => {
        setMessage("Error: " + (err.response?.data || "Failed"));
      });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Book Your Stall</h2>
      
      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="flex items-center"><div className="w-4 h-4 bg-green-500 mr-2 rounded"></div> Available</span>
        <span className="flex items-center"><div className="w-4 h-4 bg-red-500 mr-2 rounded"></div> Booked</span>
        <span className="flex items-center"><div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div> Selected</span>
      </div>

      {/* The Map Grid */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-lg mx-auto">
        {stalls.map((stall) => (
          <div
            key={stall.id}
            onClick={() => toggleSelection(stall)}
            className={`
              h-24 flex flex-col items-center justify-center border rounded cursor-pointer transition-all
              ${stall.reserved ? "bg-red-500 text-white cursor-not-allowed" : 
                selectedStalls.includes(stall.id) ? "bg-blue-500 text-white scale-105" : "bg-green-100 hover:bg-green-200 border-green-400"}
            `}
          >
            <span className="font-bold">{stall.stallCode}</span>
            <span className="text-xs">{stall.size}</span>
            <span className="text-xs">${stall.price}</span>
          </div>
        ))}
      </div>

      {/* Reserve Button */}
      {selectedStalls.length > 0 && (
        <button
          onClick={handleReservation}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Confirm Reservation ({selectedStalls.length})
        </button>
      )}

      {message && <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{message}</div>}
    </div>
  );
};

export default StallMap;