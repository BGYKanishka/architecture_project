import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import StallMap from "../../components/StallMap";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Map = () => {
  const navigate = useNavigate();
  const [user] = useState(AuthService.getCurrentUser());

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans pb-16">
      <main className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>{user ? "Back to Dashboard" : "Back to Event Home"}</span>
            </button>

            <span className="text-xs text-slate-400">
              BMICH Exhibition Complex • Colombo
            </span>
          </div>

          <div className="bg-[#0f1422] rounded-xl border border-slate-800 overflow-hidden p-3 sm:p-6 shadow-xl">
            <StallMap />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Map;
