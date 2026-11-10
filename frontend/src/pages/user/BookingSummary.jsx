import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stalls } = location.state || { stalls: [] };
  const total = stalls.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 sm:p-6 font-sans text-slate-100">
      <div className="bg-[#0f1422] max-w-lg w-full rounded-xl overflow-hidden border border-slate-800 shadow-xl">

        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Reservation Checkout</p>
          <h1 className="text-xl font-bold text-white tracking-tight">Booking Summary</h1>
          <p className="text-slate-400 text-xs mt-0.5">Review your selected stalls before confirming your reservation</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs font-medium text-slate-400 mb-3">Selected Stalls ({stalls.length})</p>

          <div className="space-y-2.5 mb-6">
            {stalls.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-[#0b0f19] p-3 rounded-lg border border-slate-800">
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-sm">Stall {s.stallCode}</span>
                  <span className="text-xs text-slate-400">{s.size} • {s.floorName ? `Hall ${s.floorName}` : 'Standard'}</span>
                </div>
                <span className="font-medium text-white text-sm">LKR {s.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-baseline border-t border-slate-800 pt-4">
            <span className="text-slate-400 text-xs font-medium">Total Rental Fee</span>
            <span className="text-xl font-bold text-white font-mono">LKR {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#0b0f19] p-5 flex items-center gap-3 border-t border-slate-800">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 px-4 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-medium hover:bg-slate-800 transition flex items-center justify-center gap-1.5 text-xs sm:text-sm"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
          </button>

          <button
            onClick={() => navigate("/payment-selection", { state: { stalls } })}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm"
          >
            <CreditCardIcon className="w-4 h-4" /> Continue to Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;
