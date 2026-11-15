import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

const destinationFor = (user) => {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const roleUpper = String(user?.role || "").toUpperCase();
  if (roles.includes("ROLE_ADMIN") || roleUpper === "ADMIN" || roleUpper === "ROLE_ADMIN") {
    return "/admin/dashboard";
  }
  if (roles.includes("ROLE_EMPLOYEE") || roleUpper === "EMPLOYEE" || roleUpper === "ROLE_EMPLOYEE") {
    return "/employee/floor-plan";
  }
  return "/dashboard";
};

export default function CognitoCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    AuthService.fetchCurrentUser()
      .then((user) => navigate(destinationFor(user), { replace: true }))
      .catch(() => setError("Sign-in could not be completed. Please try again."));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-sm text-slate-300">Finishing secure sign-in…</p>
        {error && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-rose-300">{error}</p>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="text-sm text-indigo-300 hover:text-white"
            >
              Return to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
