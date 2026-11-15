import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StallService from "../../services/stall.service";
import { CreditCardIcon, BanknotesIcon, LockClosedIcon, ArrowPathIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stalls = [] } = location.state || {};
  const [loading, setLoading] = useState(false);

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
      const totalAmount = stalls.reduce((sum, s) => sum + s.price, 0);
      const payload = {
        stallIds: stalls.map(s => s.id),
        paymentMethod: "CASH_ON_DATE"
      };

      const res = await StallService.reserveStalls(payload.stallIds, payload.paymentMethod);

      navigate("/booking-confirmation", {
        state: {
          reservationId: res.data.reservationCode,
          qrCodeImage: res.data.qrCodeImage,
          stalls: stalls,
          totalAmount
        }
      });

    } catch (err) {
      let errorMessage = err.response?.data?.message;
      if (!errorMessage && typeof err.response?.data === "object") {
        const values = Object.values(err.response.data).filter((v) => typeof v === "string");
        if (values.length > 0) {
          errorMessage = values.join(", ");
        }
      }
      if (!errorMessage && typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      }
      if (!errorMessage && err.message) {
        errorMessage = err.message;
      }
      showAlert("Reservation Error", errorMessage || "Reservation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (stalls.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 text-center">
          <h1 className="text-lg font-bold text-white">No Stalls Selected</h1>
          <p className="mt-1 text-xs text-slate-400">Choose at least one stall before proceeding.</p>
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs sm:text-sm transition shadow-sm"
          >
            Explore Floor Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-[#0f1422] rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-slate-400 hover:text-white transition">
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Select Payment Method</h2>
            <p className="text-xs text-slate-400">Choose how you will settle the reservation fee</p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Cash Option (Active) */}
          <div className="border border-indigo-500/80 bg-[#0b0f19] rounded-lg p-3.5 flex items-center gap-3.5 cursor-pointer transition">
            <div className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/60">
              <BanknotesIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm">Cash on Date</h3>
              <p className="text-xs text-slate-400">Pay at the BMICH Secretariat on event morning</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          </div>

          {/* Card Option (Disabled) */}
          <div className="border border-slate-800/80 rounded-lg p-3.5 flex items-center gap-3.5 opacity-40 cursor-not-allowed bg-[#0b0f19]/40">
            <div className="p-2.5 rounded-lg bg-slate-900 text-slate-500">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-300 text-sm">Online Card Payment</h3>
              <p className="text-xs text-slate-500">Temporarily unavailable for direct checkout</p>
            </div>
            <LockClosedIcon className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="p-5 border-t border-slate-800 bg-[#0b0f19]">
          <button
            onClick={handlePay}
            disabled={loading || stalls.length === 0}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" /> Confirming Reservation...
              </>
            ) : (
              "Confirm & Generate Pass"
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
