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

        <h1 className="text-2xl font-bold text-white tracking-tight">
          {loginFailed ? "Sign-in Failed" : "Sign In"}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {loginFailed
            ? "Sign-in could not be completed. Check your account permissions or try again."
            : "Sign in with your verified Amazon Cognito credentials to access the portal."}
        </p>

        <button
          onClick={startLogin}
          disabled={loading}
          className="mt-7 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm"
        >
          <LockClosedIcon className="w-4 h-4" />
          {loading ? "Redirecting to Cognito…" : loginFailed ? "Retry Sign In" : "Sign In with Cognito"}
        </button>

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-400">
            First time or received an invitation?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium underline">
              Create account / Set password
            </Link>
          </p>
        </div>

        <p className="text-xs text-slate-500 mt-5 text-center">
          Passwords and authentication are handled securely by Amazon Cognito.
        </p>
      </div>
    </div>
  );
};

export default Login;
