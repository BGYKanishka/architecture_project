import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { useEffect, useState } from "react";
import {
  MapIcon,
  TicketIcon,
  TagIcon,
  UserCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => AuthService.getCurrentUser());

  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(AuthService.getCurrentUser());
    };
    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const roleUpper = String(user?.role || "").toUpperCase();
    if (roles.includes("ROLE_ADMIN") || roleUpper === "ADMIN" || roleUpper === "ROLE_ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else if (roles.includes("ROLE_EMPLOYEE") || roleUpper === "EMPLOYEE" || roleUpper === "ROLE_EMPLOYEE") {
      navigate("/employee/floor-plan", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b0f19]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-16">
      {/* ── TOP HEADER BAR ── */}
      <div className="border-b border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Publisher Control Center
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.name || user.email?.split("@")[0]}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your stall bookings, view digital entry passes, and update your publisher profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition shadow-sm"
            >
              <MapIcon className="w-4 h-4" />
              <span>Book Stalls</span>
            </Link>
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium px-4 py-2.5 rounded-lg text-sm transition"
            >
              <TicketIcon className="w-4 h-4" />
              <span>My Passes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* 4 Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {/* Action 1: Map */}
          <div
            onClick={() => navigate("/map")}
            className="bg-[#0f1422] rounded-xl border border-slate-800 p-5 cursor-pointer hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                <MapIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Floor Plan</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Explore 8 thematic halls, inspect stall dimensions, and reserve slots in real time.
              </p>
            </div>
            <div className="flex items-center text-indigo-400 font-medium text-xs">
              <span>View venue map</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Action 2: Reservations */}
          <div
            onClick={() => navigate("/reservations")}
            className="bg-[#0f1422] rounded-xl border border-slate-800 p-5 cursor-pointer hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                <TicketIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">My Bookings</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                View confirmed stalls, review payment status, and download digital QR entry tickets.
              </p>
            </div>
            <div className="flex items-center text-indigo-400 font-medium text-xs">
              <span>Inspect passes</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Action 3: Genres & Categories */}
          <div
            onClick={() => navigate("/genres")}
            className="bg-[#0f1422] rounded-xl border border-slate-800 p-5 cursor-pointer hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                <TagIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Book Genres</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Select your publication categories (Fiction, Academic, Sci-Fi) to aid reader discovery.
              </p>
            </div>
            <div className="flex items-center text-indigo-400 font-medium text-xs">
              <span>Select categories</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </div>
          </div>

          {/* Action 4: Profile Settings */}
          <div
            onClick={() => navigate("/profile")}
            className="bg-[#0f1422] rounded-xl border border-slate-800 p-5 cursor-pointer hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-indigo-400 rounded-lg flex items-center justify-center mb-4">
                <UserCircleIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Profile</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Update representative contact info, publishing imprint title, and password security.
              </p>
            </div>
            <div className="flex items-center text-indigo-400 font-medium text-xs">
              <span>Manage account</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </div>
          </div>

        </div>

        {/* ── EVENT HIGHLIGHT / BANNER CARD ── */}
        <div className="bg-[#0f1422] rounded-xl border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="lg:w-2/3">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Event Details
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Colombo International Book Fair 2026
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Stall check-in and layout setup commences 48 hours prior to the ceremonial inauguration. Please ensure your booking fees are finalized and your digital QR pass is saved on your device.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CalendarDaysIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Sep 18 – 27, 2026</div>
                  <div className="text-slate-500">10 Full Days</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ClockIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">9:00 AM – 7:00 PM</div>
                  <div className="text-slate-500">Daily Public Hours</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPinIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">BMICH Colombo</div>
                  <div className="text-slate-500">All Exhibition Halls</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => navigate("/map")}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition text-center shadow-sm"
            >
              Reserve Additional Stalls
            </button>
            <button
              onClick={() => navigate("/help")}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs sm:text-sm transition text-center"
            >
              Exhibitor FAQ & Rules
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
