import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../services/auth.service";
import {
  UserCircleIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  BookOpenIcon,
  HomeIcon,
  TicketIcon,
  QuestionMarkCircleIcon,
  MapIcon
} from "@heroicons/react/24/outline";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleReservationsClick = () => {
    navigate("/reservations");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-3">
      <div className="flex justify-between items-center max-w-[1600px] mx-auto">

        {/* LEFT: Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="bg-blue-800 p-1.5 rounded-lg text-white">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-slate-800 hidden sm:block tracking-tight">
              CIBF <span className="text-blue-800">2026</span>
            </h1>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative"
            title="Dashboard"
          >
            <HomeIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigate("/map")}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative"
            title="Map"
          >
            <MapIcon className="w-6 h-6" />
          </button>          <button
            onClick={handleReservationsClick}
            className="hidden md:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-full transition font-bold text-sm"
          >
            <TicketIcon className="w-5 h-5" />

          </button>

          {/* Mobile version of ticket button */}
          <button
            onClick={handleReservationsClick}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative"
          >
            <TicketIcon className="w-6 h-6" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-full transition"
            >
              <div className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                {(user?.name || user?.email)?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 font-bold"
                  >
                    <UserCircleIcon className="w-5 h-5 " /> Profile
                  </button>
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

      {/* MENU DROPDOWN (Now always available and styled for desktop/mobile) */}
      {isMenuOpen && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsMenuOpen(false)}></div>

          <div className="absolute top-full left-4 sm:left-8 mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl py-4 px-2 z-50 animate-in slide-in-from-top-2 duration-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Navigation</p>
            <MenuLink
              icon={<HomeIcon className="w-5 h-5" />}
              label="Dashboard"
              onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}
              active={location.pathname === "/dashboard"}
            />
            <MenuLink
              icon={<MapIcon className="w-5 h-5" />}
              label="Book fair Map"
              onClick={() => { navigate("/map"); setIsMenuOpen(false); }}
              active={location.pathname === "/map" || location.pathname.startsWith("/map/")}
            />
            <MenuLink
              icon={<UserCircleIcon className="w-5 h-5" />}
              label="My Profile"
              onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
              active={location.pathname === "/profile"}
            />
            <MenuLink
              icon={<TicketIcon className="w-5 h-5" />}
              label="My Reservations"
              onClick={() => { navigate("/reservations"); setIsMenuOpen(false); }}
              active={location.pathname === "/reservations"}
            />

            <hr className="my-3 border-slate-100" />

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Support</p>
            <MenuLink
              icon={<QuestionMarkCircleIcon className="w-5 h-5" />}
              label="Help Center"
              onClick={() => { navigate("/help"); setIsMenuOpen(false); }}
              active={location.pathname === "/help"}
            />
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

export default Header;