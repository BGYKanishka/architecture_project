import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StallService from "../services/stall.service";
import {
  TrashIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  PlusIcon,
  ShoppingBagIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const Reservations = () => {
  const navigate = useNavigate();
  const [paidReservations, setPaidReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidDetails = async () => {
      try {
        const savedData = JSON.parse(localStorage.getItem("paidReservations") || "[]");
        if (savedData.length === 0) {
          setPaidReservations([]);
          setLoading(false);
          return;
        }

        // Handle both old (ID only) and new (Object) formats
        const idMap = new Map();
        savedData.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            idMap.set(item.id, item);
          } else {
            idMap.set(item, { id: item });
          }
        });

        const res = await StallService.getAllStalls();
        const allStalls = res.data;
        const filtered = allStalls
          .filter(s => idMap.has(s.id))
          .map(s => {
            const extra = idMap.get(s.id);
            return {
              ...s,
              reservationId: extra.reservationId,
              qrCodeImage: extra.qrCodeImage
            };
          });
        setPaidReservations(filtered);
      } catch (err) {
        console.error("Error loading paid reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidDetails();
  }, []);

  const cancelReservation = (stall) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel the reservation for Stall ${stall.stallCode}?`);

    if (confirmCancel) {
      const updated = paidReservations.filter(s => s.id !== stall.id);
      setPaidReservations(updated);

      // 1. Update paidReservations (preserve objects)
      const savedData = JSON.parse(localStorage.getItem("paidReservations") || "[]");
      const updatedSavedData = savedData.filter(item => (typeof item === 'object' && item !== null ? item.id : item) !== stall.id);
      localStorage.setItem("paidReservations", JSON.stringify(updatedSavedData));

      // 2. Track as cancelled for session override
      const cancelledIds = JSON.parse(localStorage.getItem("cancelledReservations") || "[]");
      if (!cancelledIds.includes(stall.id)) {
        cancelledIds.push(stall.id);
        localStorage.setItem("cancelledReservations", JSON.stringify(cancelledIds));
      }

      window.dispatchEvent(new Event("paidReservationsUpdated"));
      window.dispatchEvent(new Event("cancelledReservationsUpdated"));
    }
  };

  const total = paidReservations.reduce((sum, s) => sum + s.price, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Reservations</h1>
            <p className="text-slate-500 font-medium">Your currently active and paid stall bookings</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <PlusIcon className="w-4 h-4" /> Book More Stalls
          </button>
        </div>

        {paidReservations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">No active reservations</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">You don't have any confirmed stall reservations yet. Browse the floor plan to find your spot.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {paidReservations.map((stall) => (
                <div key={stall.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-100">
                        <span className="text-[10px] font-black text-blue-400 uppercase leading-none mb-1">Hall</span>
                        <span className="text-xl font-black text-blue-600 leading-none">{stall.floorName}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">Stall {stall.stallCode}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-green-50 text-[10px] font-bold text-green-600 rounded uppercase tracking-wider border border-green-100 italic">Confirmed</span>
                          <span className="text-sm font-bold text-blue-600 font-mono">LKR {stall.price?.toLocaleString()}</span>
                        </div>
                        {stall.reservationId && (
                          <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-tighter">ID: {stall.reservationId}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => cancelReservation(stall)}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Cancel Reservation"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* QR Code Section */}
                  {stall.reservationId && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {stall.qrCodeImage ? (
                          <img
                            src={`data:image/png;base64,${stall.qrCodeImage}`}
                            alt="QR Code"
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${stall.reservationId}`}
                            alt="QR Code"
                            className="w-20 h-20 object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700">Entrance QR Code</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Show this at the gate for stall {stall.stallCode}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 sticky top-24">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Reservation Summary</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Total Reserved</span>
                    <span className="font-bold text-slate-800">{paidReservations.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Total Payment</span>
                    <span className="font-black text-slate-900">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Value</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Your reservations are confirmed and secured. Show your QR code at the entrance for access.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5" /> Back to Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
