import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, HomeIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId, qrCodeImage, stalls, totalAmount } = location.state || {};

  React.useEffect(() => {
    if (reservationId && stalls && stalls.length > 0) {
      // 1. Get current paid reservations
      const existingPaid = JSON.parse(localStorage.getItem("paidReservations") || "[]");

      // 2. Add new ones (IDs only)
      const newPaidIds = stalls.map(s => s.id);
      const updatedPaid = Array.from(new Set([...existingPaid, ...newPaidIds]));

      // 3. Save to localStorage
      localStorage.setItem("paidReservations", JSON.stringify(updatedPaid));

      // 4. Clear selected stalls
      localStorage.setItem("selectedStalls", "[]");

      // 5. Notify other components
      window.dispatchEvent(new Event("selectedStallsUpdated"));
      window.dispatchEvent(new Event("paidReservationsUpdated"));
    }
  }, [reservationId, stalls]);

  if (!reservationId) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">No Booking Found</h2>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-blue-600 hover:underline">Return to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Booking Confirmed!</h1>
          <p className="text-slate-500 mt-2">Your stall has been successfully reserved.</p>
          <p className="text-blue-600 text-sm font-semibold mt-1">Check your email for full details.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">

          {/* Top Section */}
          <div className="bg-slate-800 p-6 text-white text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reservation ID</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{reservationId}</p>
          </div>

          {/* QR Section */}
          <div className="p-8 flex flex-col items-center justify-center border-b-2 border-dashed border-slate-200 relative">
            <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-slate-50 rounded-full"></div>
            <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-slate-50 rounded-full"></div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
              {qrCodeImage ? (
                <img
                  src={`data:image/png;base64,${qrCodeImage}`}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : reservationId ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${reservationId}`}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 text-slate-400">
                  <QrCodeIcon className="w-12 h-12" />
                  <span className="text-xs ml-2">QR Error</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Scan this QR code at the entrance</p>
          </div>

          {/* Details Section */}
          <div className="p-8 bg-white">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm">Reserved Stalls</span>
                <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                  {stalls.map((s, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                      {s.stallCode}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-slate-500 font-bold">Total Amount</span>
                <span className="text-xl font-black text-slate-800">LKR {totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <HomeIcon className="w-5 h-5" /> Return to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default BookingConfirmation;