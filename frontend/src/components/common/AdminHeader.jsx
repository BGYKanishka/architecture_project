import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthService from "../../services/auth.service";
import {
    Bars3Icon,
    ArrowLeftOnRectangleIcon,
    XMarkIcon,
    ShieldCheckIcon,
    HomeIcon,
    UsersIcon,
    BuildingStorefrontIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const AdminHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = AuthService.getCurrentUser() || {};
    const username = user.email || "Admin";
    const role = (user.roles && user.roles.length > 0) ? user.roles[0] : "ADMIN";

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await AuthService.logout();
    };

    const navItems = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <HomeIcon className="w-4 h-4" /> },
        { to: "/admin/stalls", label: "Stalls", icon: <BuildingStorefrontIcon className="w-4 h-4" /> },
        { to: "/admin/reservations", label: "Reservations", icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
        { to: "/admin/users", label: "Users", icon: <UsersIcon className="w-4 h-4" /> },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#0b0f19] border-b border-slate-800 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* LEFT: Logo & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition md:hidden"
                        aria-label="Toggle navigation"
                    >
                        {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>

                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                            <ShieldCheckIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-white tracking-tight leading-none block">
                                CIBF 2026
                            </span>
                            <span className="text-[11px] text-slate-400 block -mt-0.5">
                                Admin Portal
                            </span>
                        </div>
                    </Link>
                </div>

                {/* MIDDLE: Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`text-sm font-medium transition-colors py-1 relative flex items-center gap-1.5 ${
                                    active
                                        ? "text-white font-semibold"
                                        : "text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {active && (
                                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* RIGHT: User Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2.5 p-1 text-left rounded-lg hover:bg-slate-800/60 transition"
                    >
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold">
                            {username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="hidden sm:block text-left">
                            <span className="block text-xs font-medium text-slate-200 truncate max-w-[120px]">{username}</span>
                            <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{role}</span>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                                <div className="px-4 py-2.5 border-b border-slate-800">
                                    <p className="text-[11px] text-slate-400">Administrator</p>
                                    <p className="text-xs font-bold text-white truncate">{username}</p>
                                </div>
                                <div className="pt-1 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 font-medium transition"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-4 space-y-1">
                    {navItems.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    active
                                        ? "bg-slate-800 text-white font-semibold"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-2 mt-2 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
                        >
                            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
