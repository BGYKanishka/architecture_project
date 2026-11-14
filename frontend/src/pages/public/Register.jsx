import { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { ArrowLeftIcon, BookOpenIcon } from "@heroicons/react/24/outline";

export default function Register() {
  useEffect(() => {
    AuthService.register();
  }, []);

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
            <p className="text-xs text-slate-400">Publisher registration</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Opening Registration…</h1>
        <p className="text-sm text-slate-400 mt-2">
          Redirecting directly to the secure registration page…
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-indigo-400 text-sm">
          <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Redirecting to Cognito…</span>
        </div>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Passwords and authentication are handled securely by Amazon Cognito.
        </p>
      </div>
    </div>
  );
}
