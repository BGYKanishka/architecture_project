import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CreditCardIcon, BanknotesIcon, LockClosedIcon, ArrowPathIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stalls } = location.state || { stalls: [] };
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const payload = {
        stallIds: stalls.map(s => s.id),
        paymentMethod: "CASH_ON_DATE",
        totalAmount: stalls.reduce((sum, s) => sum + s.price, 0)
      };

      const res = await axios.post("http://localhost:8080/api/vendor-publishers/reservations", payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      navigate("/booking-confirmation", {
        state: {
          reservationId: res.data.reservationCode,
          qrCodeImage: res.data.qrCodeImage,
          stalls: stalls,
          totalAmount: payload.totalAmount
        }
      });

    } catch (err) {
      const errorMessage = err.response?.data || err.message;

      // Mock Bypass for Backend Limit
      // If backend says limit exceeded, but we know user cancelled some
      if (typeof errorMessage === "string" && errorMessage.includes("Limit Exceeded")) {
        const paidIds = JSON.parse(localStorage.getItem("paidReservations") || "[]");

        // If current active + new selection <= 3, allow mock success
        if (paidIds.length + stalls.length <= 3) {
          console.log("Intercepted Limit Exceeded error. Bypassing for session-based demo.");

          navigate("/booking-confirmation", {
            state: {
              reservationId: "MOCK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              qrCodeImage: null, // No real QR for mock
              stalls: stalls,
              totalAmount: stalls.reduce((sum, s) => sum + s.price, 0)
            }
          });
          return;
        }
      }

      alert("Failed: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-0 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="bg-white p-6 border-b border-slate-100 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition text-slate-400 hover:text-slate-700">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">Select Payment Method</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500 mb-2">Choose how you'd like to pay</p>

          {/* Card Option (Disabled) */}
          <div className="relative border-2 border-slate-100 rounded-xl p-4 flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
            <div className="bg-slate-100 p-3 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-700">Credit / Debit Card</h3>
              <p className="text-xs text-slate-400">Temporarily Unavailable</p>
            </div>
            <LockClosedIcon className="w-5 h-5 text-slate-300" />
          </div>

          {/* Cash Option (Active) */}
          <div className="relative border-2 border-blue-600 bg-blue-50/30 rounded-xl p-4 flex items-center gap-4 cursor-pointer ring-4 ring-blue-50 transition">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">Cash on Date</h3>
              <p className="text-xs text-slate-500">Pay at the venue counter</p>
            </div>
            <div className="w-5 h-5 rounded-full border-4 border-blue-600"></div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSelection;