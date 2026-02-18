import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import StallMap from "../../components/map/StallMap";

const StallSelection = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="py-6 sm:py-10 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">


          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <StallMap />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StallSelection;