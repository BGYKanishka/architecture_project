import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

const VerificationResultModal = ({ isOpen, onClose, data, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 flex justify-end">
                    <button onClick={onClose} className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 -mt-8">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="mt-4 font-semibold text-slate-400 text-sm">Verifying Credential with Server...</p>
                        </div>
                    ) : error ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                            <XCircleIcon className="w-20 h-20 text-rose-500 mb-3" />
                            <h2 className="text-2xl font-black text-white">Verification Failed</h2>
                            <p className="text-slate-400 text-sm mt-2">{error}</p>
                        </div>
                    ) : data && data.accessGranted ? (
                        <div className="space-y-5 pt-2">
                            <div className="flex flex-col items-center justify-center text-center">
                                <CheckCircleIcon className="w-16 h-16 text-emerald-400 mb-2" />
                                <h2 className="text-2xl font-black text-white">Access Granted</h2>
                                <p className="text-emerald-400 font-medium text-xs sm:text-sm">{data.message}</p>
                            </div>

                            {/* User Details */}
                            {data.user && (
                                <div className="bg-[#080b14] rounded-2xl p-4 border border-slate-800/80">
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Attendee Information</h3>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                                        <div>
                                            <p className="text-slate-500 text-[11px]">Name</p>
                                            <p className="font-bold text-white text-sm">{data.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-[11px]">Role</p>
                                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 font-bold text-[10px] rounded uppercase tracking-wide">
                                                {data.user.role}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-slate-500 text-[11px]">Email</p>
                                            <p className="font-semibold text-slate-300">{data.user.email}</p>
                                        </div>
                                        {data.user.businessName && (
                                            <div className="col-span-2 pt-2 border-t border-slate-800">
                                                <p className="text-slate-500 text-[11px]">Business Name</p>
                                                <p className="font-bold text-white">{data.user.businessName}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reservation Details */}
                            {data.reservation && (
                                <div className="bg-[#080b14] rounded-2xl p-4 border border-slate-800/80">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Booking Status</h3>
                                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{data.reservation.status}</span>
                                    </div>

                                    {data.reservation.stalls && data.reservation.stalls.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Stalls ({data.reservation.stalls.length})</p>
                                            {data.reservation.stalls.map(stall => (
                                                <div key={stall.id} className="flex justify-between items-center bg-[#0d1322] p-2.5 rounded-xl border border-slate-800">
                                                    <div>
                                                        <p className="font-black text-white text-xs">{stall.stallCode}</p>
                                                        <p className="text-[10px] text-slate-400">{stall.floorName} • {stall.size}</p>
                                                    </div>
                                                    <p className="text-xs font-bold text-indigo-400">LKR {stall.price?.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {data.reservation.payment && (
                                        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Payment Status</span>
                                                <span className={`font-bold ${data.reservation.payment.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {data.reservation.payment.paymentStatus}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Total Amount</span>
                                                <span className="font-bold text-white">LKR {data.reservation.payment.amount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                            <XCircleIcon className="w-16 h-16 text-rose-500 mb-3" />
                            <h2 className="text-2xl font-black text-white">Access Denied</h2>
                            <p className="text-slate-400 text-xs sm:text-sm mt-2">{data?.message || "Invalid or unconfirmed reservation ticket."}</p>
                        </div>
                    )}

                    {!isLoading && (
                        <button
                            onClick={onClose}
                            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition text-xs sm:text-sm"
                        >
                            Dismiss
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationResultModal;
