import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import {

  UserCircleIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  BookOpenIcon,
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  QuestionMarkCircleIcon
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
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-4 sm:px-8 py-3 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-[1600px] mx-auto">

        {/* LEFT: Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-600 dark:text-slate-400"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="bg-blue-800 p-1.5 rounded-lg text-white">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white hidden sm:block tracking-tight">
              CIBF <span className="text-blue-800 dark:text-blue-400">2026</span>
            </h1>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition relative"
            title="Dashboard"
          >
            <HomeIcon className="w-6 h-6" />
          </button>



          <button
            onClick={handleReservationsClick}
            className="p-2  text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition relative"
          >
            <TicketIcon className="w-6 h-6" />
            <span className="hidden md:block font-bold text-sm"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
            >
              <div className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                {(user?.name || user?.email)?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in duration-150">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold"
                >
                  <UserCircleIcon className="w-5 h-5 " /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU DROPDOWN (Now always available and styled for desktop/mobile) */}
      {isMenuOpen && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsMenuOpen(false)}></div>

          <div className="absolute top-full left-4 sm:left-8 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl py-4 px-2 z-50 animate-in slide-in-from-top-2 duration-200">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2">Navigation</p>
            <MenuLink
              icon={<HomeIcon className="w-5 h-5" />}
              label="Dashboard"
              onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}
              active={location.pathname === "/dashboard"}
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

            <hr className="my-3 border-slate-100 dark:border-slate-800" />

            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-2">Support</p>
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
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
      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {icon}
    {label}
  </button>
);

export default Header;