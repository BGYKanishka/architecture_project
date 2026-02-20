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

      // 2. Add new ones (Full objects)
      const newPaidObjects = stalls.map(s => ({
        id: s.id,
        reservationId: reservationId,
        qrCodeImage: qrCodeImage
      }));

      // Filter out any duplicates by ID
      const existingIds = new Set(existingPaid.map(item => item.id || item));
      const filteredNew = newPaidObjects.filter(item => !existingIds.has(item.id));

      // Merge and save
      const updatedPaid = [...existingPaid, ...filteredNew];
      localStorage.setItem("paidReservations", JSON.stringify(updatedPaid));

      // 4. Clear selected stalls
      localStorage.setItem("selectedStalls", "[]");

      // 5. Notify other components
      window.dispatchEvent(new Event("selectedStallsUpdated"));
      window.dispatchEvent(new Event("paidReservationsUpdated"));
    }
  }, [reservationId, stalls]);

  if (!reservationId) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">No Booking Found</h2>
        <button onClick={() => navigate("/dashboard")} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">Return to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-lg w-full">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Booking Confirmed!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Your stall has been successfully reserved.</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-1">Check your email for full details.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">

          {/* Top Section */}
          <div className="bg-slate-800 p-6 text-white text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reservation ID</p>
            <p className="text-2xl font-mono font-bold tracking-wider">{reservationId}</p>
          </div>

          {/* QR Section */}
          <div className="p-8 flex flex-col items-center justify-center border-b-2 border-dashed border-slate-200 dark:border-slate-700 relative">
            <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full"></div>
            <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-slate-50 dark:bg-slate-950 rounded-full"></div>

            <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
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
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400">
                  <QrCodeIcon className="w-12 h-12" />
                  <span className="text-xs ml-2">QR Error</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">Scan this QR code at the entrance</p>
          </div>

          {/* Details Section */}
          <div className="p-8 bg-white dark:bg-slate-900">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Reserved Stalls</span>
                <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                  {stalls.map((s, i) => (
                    <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-bold border border-blue-100 dark:border-blue-800">
                      {s.stallCode}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold">Total Amount</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">LKR {totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => navigate("/genres")}
              className="w-full py-3 bg-blue-600 border border-transparent rounded-xl text-white font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <HomeIcon className="w-5 h-5" /> Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default BookingConfirmation;