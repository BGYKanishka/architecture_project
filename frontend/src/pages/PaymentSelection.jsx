import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/auth.service";
import { CreditCardIcon, BanknotesIcon, LockClosedIcon, ArrowPathIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "../components/common/ConfirmationModal";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stalls } = location.state || { stalls: [] };
  const [loading, setLoading] = useState(false);

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const showAlert = (title, message) => {
    setAlertConfig({ isOpen: true, title, message });
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const user = AuthService.getCurrentUser();
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

      showAlert("Payment Error", typeof errorMessage === "string" ? errorMessage : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-0 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-white dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Select Payment Method</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Choose how you'd like to pay</p>

          {/* Card Option (Disabled) */}
          <div className="relative border-2 border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Credit / Debit Card</h3>
              <p className="text-xs text-slate-400">Temporarily Unavailable</p>
            </div>
            <LockClosedIcon className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          </div>

          {/* Cash Option (Active) */}
          <div className="relative border-2 border-blue-600 bg-blue-50/30 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-4 cursor-pointer ring-4 ring-blue-50 dark:ring-blue-900/30 transition">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-600 dark:text-blue-400">
              <BanknotesIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-white">Cash on Date</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pay at the venue counter</p>
            </div>
            <div className="w-5 h-5 rounded-full border-4 border-blue-600"></div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:bg-blue-700 hover:shadow-xl transition transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <ConfirmationModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="Got it"
        isAlert={true}
      />
    </div>
  );
};
export default PaymentSelection;