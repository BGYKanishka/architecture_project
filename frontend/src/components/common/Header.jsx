import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import {
  UserCircleIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  BookOpenIcon,
  TicketIcon,
  HomeIcon,
  ShieldCheckIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await AuthService.logout();
  };

  const isLoggedIn = !!user;
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const roleUpper = String(user?.role || "").toUpperCase();
  const isAdmin = roles.includes("ROLE_ADMIN") || roleUpper === "ADMIN" || roleUpper === "ROLE_ADMIN";
  const isEmployee = roles.includes("ROLE_EMPLOYEE") || roleUpper === "EMPLOYEE" || roleUpper === "ROLE_EMPLOYEE";
  const isVendor = isLoggedIn && !isAdmin && !isEmployee;

  let portalLink = "/dashboard";
  let portalLabel = "Dashboard";
  if (isAdmin) {
    portalLink = "/admin/dashboard";
    portalLabel = "Admin Panel";
  } else if (isEmployee) {
    portalLink = "/employee/floor-plan";
    portalLabel = "Staff Portal";
  }

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    ...(isLoggedIn ? [{ to: portalLink, label: portalLabel }] : []),
    ...(isVendor || !isLoggedIn ? [{ to: "/map", label: "Floor Plan & Stalls" }] : []),
    ...(isVendor ? [{ to: "/reservations", label: "My Bookings" }] : []),
    { to: "/about", label: "About Fair" },
    { to: "/help", label: "Help" },
  ];

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19] border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* LEFT: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight leading-none block">
                CIBF 2026
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                Colombo Book Fair
              </span>
            </div>
          </Link>
        </div>

        {/* MIDDLE: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors py-1 relative ${active
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isVendor && (
                <Link
                  to="/reservations"
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition"
                >
                  <TicketIcon className="w-4 h-4 text-indigo-400" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isEmployee && (
                <Link
                  to="/employee/floor-plan"
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/80 px-3 py-1.5 rounded-lg transition"
                >
                  <QrCodeIcon className="w-4 h-4 text-indigo-400" />
                  <span>Staff Portal</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/80 px-3 py-1.5 rounded-lg transition"
                >
                  <ShieldCheckIcon className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1 text-left rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold">
                    {(user?.name || user?.email)?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:block text-xs font-medium text-slate-300 max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-[11px] text-slate-400">
                          {isAdmin ? "Administrator" : isEmployee ? "Staff Member" : "Signed in as"}
                        </p>
                        <p className="text-xs font-bold text-white truncate">{user?.name || user?.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate(portalLink);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                      >
                        <HomeIcon className="w-4 h-4 text-slate-400" />
                        <span>{portalLabel}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                      >
                        <UserCircleIcon className="w-4 h-4 text-slate-400" />
                        <span>Profile Settings</span>
                      </button>

                      {isVendor && (
                        <button
                          onClick={() => {
                            navigate("/reservations");
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                        >
                          <TicketIcon className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>
                      )}

                      <div className="pt-1 mt-1 border-t border-slate-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-medium transition cursor-pointer"
                        >
                          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => AuthService.login()}
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => AuthService.register()}
                className="text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${active
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!isLoggedIn && (
            <div className="pt-3 mt-3 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  AuthService.login();
                }}
                className="flex-1 text-center py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  AuthService.register();
                }}
                className="flex-1 text-center py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
