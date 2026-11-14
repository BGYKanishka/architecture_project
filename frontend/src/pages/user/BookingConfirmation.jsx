import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, ArrowRightIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId, qrCodeImage, stalls, totalAmount } = location.state || {};

  useEffect(() => {
    if (reservationId && stalls && stalls.length > 0) {
      // Clear the stall selection cart — the booking is complete
      window.dispatchEvent(new Event("selectedStallsUpdated"));
    }
  }, [reservationId, stalls]);

  if (!reservationId) return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center font-sans text-slate-100 p-4">
      <div className="text-center p-8 bg-[#0f1422] border border-slate-800 rounded-xl max-w-sm w-full">
        <h2 className="text-lg font-bold text-white">No Booking Found</h2>
        <p className="text-xs text-slate-400 mt-1">Please select stalls on the map to create a reservation.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs sm:text-sm transition">
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">
      <div className="max-w-md w-full">

        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircleIcon className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Booking Confirmed</h1>
          <p className="text-slate-400 mt-1 text-xs">Your stall has been securely reserved at CIBF 2026.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-[#0f1422] rounded-xl shadow-xl overflow-hidden border border-slate-800">

          <div className="p-4 bg-[#0b0f19] text-center border-b border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Reservation Reference</p>
            <p className="text-xl font-mono font-bold text-indigo-400 mt-0.5">{reservationId}</p>
          </div>

          {/* QR Section */}
          <div className="p-6 flex flex-col items-center justify-center border-b border-slate-800 bg-[#0f1422]">
            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-200">
              {qrCodeImage ? (
                <img
                  src={`data:image/png;base64,${qrCodeImage}`}
                  alt="QR Code"
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center bg-slate-100 text-slate-400">
                  <QrCodeIcon className="w-10 h-10" />
                  <span className="text-xs ml-2">QR unavailable</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">Scan this digital pass at BMICH exhibition gates</p>
          </div>

          {/* Details Section */}
          <div className="p-5 space-y-3.5 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-medium">Reserved Stalls</span>
              <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
                {stalls?.map((s, idx) => (
                  <span key={idx} className="bg-[#0b0f19] border border-slate-800 px-2 py-0.5 rounded text-white font-medium">
                    {s.stallCode} ({s.floorName})
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
              <span className="text-slate-400 font-medium">Payment Mode</span>
              <span className="text-slate-200 font-medium">Cash on Date</span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
              <span className="text-slate-400 font-medium">Total Rental</span>
              <span className="text-base font-bold text-white font-mono">
                LKR {totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 bg-[#0b0f19]">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm"
            >
              <span>Go to My Dashboard</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
