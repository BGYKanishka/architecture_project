import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import backgroundImg from "../../assets/background.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ArrowLeftIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    AuthService.login(email, password).then(
      () => {
        const user = AuthService.getCurrentUser();
        const role = user?.role || (user?.roles && user.roles[0]) || "";

        if (role === "ADMIN" || role === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "EMPLOYEE" || role === "ROLE_EMPLOYEE") {
          navigate("/employee/floor-plan");
        } else {
          navigate("/dashboard");
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data.error)) ||
          error.message ||
          "Invalid email or password. Please verify your credentials.";
        setError(resMessage);
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0b0f19] text-slate-100 font-sans">
      {/* Top Navigation - Natural link, no pill frame */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-[#0f1422] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex my-8">

        {/* Left Side: Editorial Banner */}
        <div className="relative w-1/2 min-h-[540px] hidden md:block overflow-hidden">
          <img
            src={backgroundImg}
            alt="CIBF Exhibition"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-[#0f1422]/80 to-transparent" />

          <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <BookOpenIcon className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs tracking-wider uppercase text-slate-300">
                CIBF 2026
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Exhibitor & Staff Access</p>
              <h2 className="text-2xl font-bold leading-tight mb-3 text-white">
                Empowering Publishers & Readers
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sign in to manage stall reservations, download digital QR gate tickets, and review floor assignments.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              September 18 – 27, 2026 • BMICH Colombo
            </p>
          </div>
        </div>

        {/* Right Side: Sign-In Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-8 sm:p-10">
          <div className="w-full max-w-sm space-y-6">

            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Sign In
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="publisher@domain.com"
                  className="w-full px-3.5 py-2.5 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs text-rose-300 bg-rose-950/60 rounded-lg border border-rose-800/60">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-white bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg text-sm transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                New to CIBF?{" "}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1">
                  Create Publisher Account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
