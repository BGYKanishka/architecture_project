import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import api from "../../services/api";
import {
    Bars3Icon,
    ArrowLeftOnRectangleIcon,
    XMarkIcon,
    BookOpenIcon,
    HomeIcon,
    QrCodeIcon
} from "@heroicons/react/24/outline";
import QRScannerModal from "../QRScannerModal";
import VerificationResultModal from "../VerificationResultModal";

const EmployeeHeader = ({ user }) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // QR Scanner State
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [scanResultData, setScanResultData] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [scanError, setScanError] = useState(null);

    const currentUser = user || AuthService.getCurrentUser();

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await AuthService.logout();
    };

    const handleScanSuccess = async (decodedText) => {
        setIsScannerOpen(false);
        setIsResultOpen(true);
        setIsVerifying(true);
        setScanError(null);
        setScanResultData(null);

        try {
            let qrToken = decodedText;
            if (qrToken.includes("-C-")) {
                qrToken = qrToken.split("-C-")[0];
            }

            const response = await api.get(`/employee/qr/${qrToken}`);
            setScanResultData(response.data);
        } catch (error) {
            console.error("QR Verification Error:", error);
            setScanError(error.response?.data?.message || "Failed to connect to the verification server.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#0b0f19] border-b border-slate-800 text-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* LEFT: Logo & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition md:hidden"
                            aria-label="Toggle Navigation"
                        >
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>

                        <Link to="/employee/floor-plan" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                                <BookOpenIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-base font-bold text-white tracking-tight leading-none block">
                                    CIBF 2026
                                </span>
                                <span className="text-[11px] text-slate-400 block -mt-0.5">
                                    Staff Portal
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg font-medium transition text-xs sm:text-sm shadow-sm"
                        >
                            <QrCodeIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Scan QR Ticket</span>
                            <span className="sm:hidden">Scan</span>
                        </button>

                        <Link
                            to="/employee/floor-plan"
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition hidden sm:flex items-center justify-center border border-slate-800"
                            title="Floor Plan Navigation"
                        >
                            <HomeIcon className="w-4 h-4" />
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 p-1 text-left rounded-lg hover:bg-slate-800/60 transition"
                            >
                                <div className="w-8 h-8 bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg flex items-center justify-center text-xs font-bold">
                                    {(currentUser?.name || currentUser?.email)?.charAt(0).toUpperCase() || "E"}
                                </div>
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                                        <div className="px-4 py-2.5 border-b border-slate-800">
                                            <p className="text-[11px] text-slate-400">Staff Member</p>
                                            <p className="text-xs font-bold text-white break-all">{currentUser?.email || "Employee"}</p>
                                        </div>
                                        <div className="pt-1 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-medium transition"
                                            >
                                                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-4 space-y-1">
                        <button
                            onClick={() => { setIsScannerOpen(true); setIsMenuOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-400 hover:bg-slate-800"
                        >
                            <QrCodeIcon className="w-4 h-4" />
                            <span>Scan Ticket</span>
                        </button>

                        <Link
                            to="/employee/floor-plan"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            <HomeIcon className="w-4 h-4" />
                            <span>Floor Plan</span>
                        </Link>

                        <div className="pt-2 mt-2 border-t border-slate-800">
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
                            >
                                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <QRScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />

            <VerificationResultModal
                isOpen={isResultOpen}
                onClose={() => setIsResultOpen(false)}
                data={scanResultData}
                isLoading={isVerifying}
                error={scanError}
            />
        </>
    );
};

export default EmployeeHeader;
