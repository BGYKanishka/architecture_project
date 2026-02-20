import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../services/auth.service";
import axios from "axios";
import {
  UserCircleIcon,
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
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // QR Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [scanResultData, setScanResultData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanError, setScanError] = useState(null);

  // Fallback if user prop is missing
  const currentUser = user || AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleScanSuccess = async (decodedText) => {
    setIsScannerOpen(false);
    setIsResultOpen(true);
    setIsVerifying(true);
    setScanError(null);
    setScanResultData(null);

    // Attempt to verify with backend
    try {
      const token = AuthService.getCurrentUser()?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Clean up the qr string, sometimes they rescan the "-C-" string
      let qrToken = decodedText;
      if (qrToken.includes("-C-")) {
        qrToken = qrToken.split("-C-")[0];
      }

      const response = await axios.get(`http://localhost:8080/api/employee/qr/${qrToken}`, config);
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
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">

          {/* LEFT: Menu Button & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
            >
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/employee/floor-plan")}>
              <div className="bg-blue-800 p-1.5 rounded-lg text-white">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-black text-slate-800 hidden sm:block tracking-tight">
                CIBF 2026 <span className="text-blue-800">Employee Portal</span>
              </h1>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition shadow-sm text-sm"
            >
              <QrCodeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              onClick={() => navigate("/employee/floor-plan")}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative hidden sm:block"
              title="Floor Plan Dashboard"
            >
              <HomeIcon className="w-6 h-6" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-full transition"
              >
                <div className="w-9 h-9 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold">
                  {(currentUser?.name || currentUser?.email)?.charAt(0).toUpperCase() || "E"}
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 break-all">{currentUser?.email || "Employee"}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">EMPLOYEE</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MENU DROPDOWN */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute top-full left-4 sm:left-8 mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl py-4 px-2 z-50 animate-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Navigation</p>

              <MenuLink
                icon={<QrCodeIcon className="w-5 h-5" />}
                label="Scan Ticket"
                onClick={() => { setIsScannerOpen(true); setIsMenuOpen(false); }}
                active={false}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-blue-600 bg-blue-50/50 hover:bg-blue-100 mb-1"
              />

              <MenuLink
                icon={<HomeIcon className="w-5 h-5" />}
                label="Floor Plan"
                onClick={() => { navigate("/employee/floor-plan"); setIsMenuOpen(false); }}
                active={location.pathname.includes("/employee/floor-plan")}
              />

              <hr className="my-3 border-slate-100" />

              <MenuLink
                icon={<ArrowLeftOnRectangleIcon className="w-5 h-5" />}
                label="Logout"
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                active={false}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-red-600 hover:bg-red-50 hover:text-red-700"
              />
            </div>
          </>
        )}
      </nav>

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

// Helper component for menu items
const MenuLink = ({ icon, label, onClick, active = false, className }) => (
  <button
    onClick={onClick}
    className={className || `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${active
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
  >
    {icon}
    {label}
  </button>
);

export default EmployeeHeader;
