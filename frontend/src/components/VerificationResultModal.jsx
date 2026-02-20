import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

const VerificationResultModal = ({ isOpen, onClose, data, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 flex justify-end">
                    <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition relative top-0 right-0 z-10 text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 -mt-10">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-medium text-slate-500">Verifying Ticket...</p>
                        </div>
                    ) : error ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                            <XCircleIcon className="w-20 h-20 text-red-500 mb-4" />
                            <h2 className="text-2xl font-black text-slate-800">Verification Failed</h2>
                            <p className="text-slate-500 mt-2">{error}</p>
                        </div>
                    ) : data && data.accessGranted ? (
                        <div className="space-y-6 pt-4">
                            <div className="flex flex-col items-center justify-center text-center">
                                <CheckCircleIcon className="w-20 h-20 text-emerald-500 mb-2" />
                                <h2 className="text-2xl font-black text-slate-800">Access Granted</h2>
                                <p className="text-emerald-600 font-medium">{data.message}</p>
                            </div>

                            {/* User Details */}
                            {data.user && (
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attendee Information</h3>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                                        <div>
                                            <p className="text-slate-500 text-xs text-balance">Name</p>
                                            <p className="font-bold text-slate-800">{data.user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs">Role</p>
                                            <div className="inline-block mt-0.5 px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded uppercase tracking-wide">
                                                {data.user.role}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-slate-500 text-xs">Email</p>
                                            <p className="font-semibold text-slate-800">{data.user.email}</p>
                                        </div>
                                        {data.user.businessName && (
                                            <div className="col-span-2 pt-2 border-t border-slate-200 mt-1">
                                                <p className="text-slate-500 text-xs">Business Name</p>
                                                <p className="font-bold text-slate-800">{data.user.businessName}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reservation Details */}
                            {data.reservation && (
                                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Reservation Details</h3>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm font-semibold text-slate-600">Status</p>
                                        <p className="text-sm font-black text-emerald-600">{data.reservation.status}</p>
                                    </div>

                                    {data.reservation.stalls && data.reservation.stalls.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Stalls ({data.reservation.stalls.length})</p>
                                            {data.reservation.stalls.map(stall => (
                                                <div key={stall.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <div>
                                                        <p className="font-black text-slate-800">{stall.stallCode}</p>
                                                        <p className="text-xs text-slate-500">{stall.floorName} - {stall.size}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-600">LKR {stall.price?.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {data.reservation.payment && (
                                        <div className="mt-4 pt-4 border-t border-blue-100/50 flex flex-col gap-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Payment Status</span>
                                                <span className={`font-bold ${data.reservation.payment.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {data.reservation.payment.paymentStatus}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Amount</span>
                                                <span className="font-black text-slate-800">LKR {data.reservation.payment.amount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                            <XCircleIcon className="w-20 h-20 text-red-500 mb-4" />
                            <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
                            <p className="text-slate-500 mt-2">{data?.message || "Invalid or unconfirmed reservation."}</p>
                        </div>
                    )}

                    {!isLoading && (
                        <button
                            onClick={onClose}
                            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationResultModal;
