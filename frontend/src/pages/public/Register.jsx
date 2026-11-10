import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import backgroundImg from "../../assets/background.jpg";
import { ArrowLeftIcon, BookOpenIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "VENDOR",
    contactNumber: "",
    businessName: "",
  });
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    setLoading(true);

    AuthService.register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.contactNumber,
      formData.businessName
    ).then(
      () => {
        setMessage("Account registered successfully! Redirecting to sign in...");
        setSuccessful(true);
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data.error)) ||
          (typeof error.response?.data === "string" ? error.response.data : null) ||
          error.message ||
          "Registration failed. Please check your information.";

        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0b0f19] text-slate-100 font-sans">
      {/* Top Navigation - Natural link */}
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

        {/* Left Side: Brand & Visuals */}
        <div className="relative w-1/2 min-h-[620px] hidden md:block overflow-hidden">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">Publisher Registration</p>
              <h2 className="text-2xl font-bold leading-tight mb-3 text-white">
                Exhibit at South Asia’s Biggest Book Fair
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Register your publishing house or book store to secure stall reservations, select your preferred halls, and reach over 1,000,000 visitors.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              September 18 – 27, 2026 • BMICH Colombo
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-8 sm:p-10">
          <div className="w-full max-w-sm space-y-5">

            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Register as a publisher to book and manage stalls.
              </p>
            </div>

            <form className="space-y-3.5" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Representative Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Johnathan Silva"
                  className="w-full px-3.5 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Business / Publishing House
                </label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="e.g. Ceylon Book House"
                  className="w-full px-3.5 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={formData.businessName}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="publisher@domain.com"
                  className="w-full px-3.5 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="+94 77 123 4567"
                  className="w-full px-3.5 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={formData.contactNumber}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
              </div>

              {message && (
                <div
                  className={`p-3 text-xs rounded-lg border font-medium flex items-center gap-2 ${
                    successful
                      ? "bg-emerald-950/70 text-emerald-300 border-emerald-800/60"
                      : "bg-rose-950/70 text-rose-300 border-rose-800/60"
                  }`}
                >
                  {successful && <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />}
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || successful}
                className="w-full py-2.5 text-white bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg text-sm transition shadow-sm disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1">
                  Sign in here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
