import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StallService from "../../services/stall.service";
import {
  TrashIcon,
  ArrowLeftIcon,
  PlusIcon,
  ShoppingBagIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const Reservations = () => {
  const navigate = useNavigate();
  const [paidReservations, setPaidReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stallToCancel, setStallToCancel] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: ""
  });

  const showAlert = (title, message) => {
    setAlertConfig({ isOpen: true, title, message });
  };

  useEffect(() => {
    const fetchPaidDetails = async () => {
      try {
        setLoading(true);
        const res = await StallService.getMyReservations();
        setPaidReservations(res.data);
      } catch (err) {
        console.error("Error loading reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidDetails();
  }, []);

  const handleCancelClick = (stall) => {
    setStallToCancel(stall);
    setIsModalOpen(true);
  };

  const confirmCancelReservation = async () => {
    if (!stallToCancel) return;

    try {
      await StallService.cancelReservation(stallToCancel.id);
      setPaidReservations(paidReservations.filter((p) => p.id !== stallToCancel.id));
      setIsModalOpen(false);
      showAlert("Cancelled", `Reservation for Stall ${stallToCancel.stallCode} has been cancelled.`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      showAlert("Cancellation Failed", typeof errorMessage === "string" ? errorMessage : "Could not cancel reservation.");
    }
  };

  const total = paidReservations.reduce((sum, item) => sum + (item.price || 0), 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <ArrowLeftIcon className="w-3 h-3" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs text-indigo-400 font-medium">My Bookings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Stall Reservations</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Your confirmed exhibition slots and entry passes for CIBF 2026</p>
          </div>
          <button
            onClick={() => navigate("/map")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs sm:text-sm font-medium transition shadow-sm self-start sm:self-auto"
          >
            <PlusIcon className="w-4 h-4" /> Book Additional Stalls
          </button>
        </div>

        {paidReservations.length === 0 ? (
          <div className="bg-[#0f1422] rounded-xl p-12 text-center border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="w-6 h-6 text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">No active reservations</h2>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto text-xs leading-relaxed">
              You have not reserved any stalls yet for CIBF 2026. Explore the floor plan to select and lock your spaces.
            </p>
            <button
              onClick={() => navigate("/map")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs sm:text-sm font-medium transition"
            >
              Browse Floor Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {paidReservations.map((stall) => (
                <div key={stall.id} className="bg-[#0f1422] rounded-xl p-5 border border-slate-800 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-lg flex flex-col items-center justify-center border border-slate-800 shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase leading-none mb-0.5">Hall</span>
                        <span className="text-base font-bold text-white leading-none">{stall.floorName}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Stall {stall.stallCode}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Confirmed
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            LKR {stall.price?.toLocaleString()}
                          </span>
                        </div>
                        {stall.reservationCode && (
                          <p className="text-[11px] text-slate-500 mt-1 font-mono">
                            Ref: {stall.reservationCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelClick(stall)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                      title="Cancel Reservation"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QR Code Section */}
                  {stall.reservationCode && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-4">
                      <div className="bg-white p-1.5 rounded-lg shrink-0">
                        {stall.qrCodeImage ? (
                          <img
                            src={`data:image/png;base64,${stall.qrCodeImage}`}
                            alt="QR Code"
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${stall.reservationCode}`}
                            alt="QR Code"
                            className="w-16 h-16 object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Digital Gate Pass</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          Scan this credential at BMICH entrance gates for official exhibitor badge verification.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f1422] rounded-xl p-5 border border-slate-800 sticky top-24">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800">
                  Summary
                </h3>

                <div className="space-y-3 mb-5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Reserved Stalls</span>
                    <span className="font-semibold text-white">{paidReservations.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status</span>
                    <span className="font-medium text-emerald-400">Confirmed</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mb-5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-xl font-bold text-white">
                      LKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0b0f19] border border-slate-800 p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Stalls are reserved in the database. Download or screenshot your QR token for exhibition days.
                  </p>
                </div>
              </div>

              <Link
                to="/map"
                className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Return to Floor Plan</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancelReservation}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel the reservation for Stall ${stallToCancel?.stallCode}?`}
        confirmText="Yes, Cancel"
        cancelText="Keep Reservation"
      />

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

export default Reservations;
