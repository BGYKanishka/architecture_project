import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stalls } = location.state || { stalls: [] };
  const total = stalls.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-3 origin-bottom-left"></div>
          <h1 className="text-2xl font-bold relative z-10">Booking Summary</h1>
          <p className="text-blue-100 text-sm mt-1 relative z-10">Review your selection before payment</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Selected Stalls</h3>

          <div className="space-y-3 mb-6">
            {stalls.map((s, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{s.stallCode}</span>
                  <span className="text-xs text-slate-500">{s.size}</span>
                </div>
                <span className="font-mono font-bold text-slate-800">LKR {s.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
            <span className="text-slate-500 font-medium">Total Amount</span>
            <span className="text-2xl font-black text-blue-600">LKR {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row gap-4 border-t border-slate-100">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-white hover:border-slate-400 transition flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Go Back
          </button>

          <button
            onClick={() => navigate("/payment-selection", { state: { stalls } })}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCardIcon className="w-5 h-5" /> Proceed to Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;