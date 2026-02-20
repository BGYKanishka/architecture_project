import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useEffect, useState } from "react";
import {
  MapIcon,
  TicketIcon,
  TagIcon,
  UserCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-800 text-white pb-24 pt-12 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back !
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Get ready for the Colombo International Book Fair 2026. Manage your stall reservations, explore the floor plan, and customize your experience.
          </p>
        </div>
      </div>

      <main className="px-4 sm:px-8 -mt-16 pb-12">
        <div className="max-w-[1200px] mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Quick Action: Map */}
            <div
              onClick={() => navigate("/map")}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 cursor-pointer hover:shadow-md hover:border-blue-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Explore Map</h3>
                <p className="text-slate-500 mb-6">
                  View the interactive floor plan and browse available stalls across all halls.
                </p>
              </div>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                <span>View Floor Plan</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Quick Action: Reservations */}
            <div
              onClick={() => navigate("/reservations")}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 cursor-pointer hover:shadow-md hover:teal-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TicketIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">My Reservations</h3>
                <p className="text-slate-500 mb-6">
                  Manage your booked stalls, make payments, and download confirmation tickets.
                </p>
              </div>
              <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-1 transition-transform">
                <span>View Bookings</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </div>
            </div>


          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
                <BookOpenIcon className="w-20 h-20 text-blue-800" />
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-4">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Upcoming Event</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">
                CIBF 2026 Registration is Open!
              </h2>
              <p className="text-slate-600 mb-6 text-lg">
                The grandest book fair is back. Secure your stalls early to get the best spots in the main halls. If you need assistance with bulk bookings, please contact our support team.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/map")}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm"
                >
                  Book a Stall Now
                </button>
                <button
                  onClick={() => navigate("/help")}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold transition"
                >
                  Help Center
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;