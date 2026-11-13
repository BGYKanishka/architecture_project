import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { ArrowLeftIcon, BookOpenIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const loginFailed = new URLSearchParams(location.search).has("error");

  const startLogin = () => {
    setLoading(true);
    AuthService.login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0b0f19] text-slate-100 font-sans">
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition">
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#0f1422] rounded-2xl border border-slate-800 shadow-2xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <BookOpenIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white">CIBF 2026</p>
            <p className="text-xs text-slate-400">Secure account access</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in</h1>
        <p className="text-sm text-slate-400 mt-2">
          Continue to the secure Colombo International Book Fair sign-in page.
        </p>

        {loginFailed && (
          <p className="mt-5 text-sm text-rose-300" role="alert">
            Sign-in could not be completed. Check your account or try again.
          </p>
        )}

        <button
          onClick={startLogin}
          disabled={loading}
          className="mt-7 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold transition"
        >
          <LockClosedIcon className="w-4 h-4" />
          {loading ? "Opening secure sign-in…" : "Continue to sign in"}
        </button>

        <p className="text-xs text-slate-500 mt-5 text-center">
          New publishers can choose “Sign up” on the secure sign-in page.
        </p>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Passwords and recovery are handled by Amazon Cognito.
        </p>
      </div>
    </div>
  );
};

export default Login;
