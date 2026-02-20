import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import {
    UserCircleIcon,
    Bars3Icon,
    ArrowLeftOnRectangleIcon,
    BellIcon,
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

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-3">
            <div className="flex justify-between items-center max-w-[1600px] mx-auto">

                {/* LEFT: Menu Button & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
                    >
                        {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                        <div className="bg-blue-800 p-1.5 rounded-lg text-white">
                            <ShieldCheckIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-black text-slate-800 hidden sm:block tracking-tight">
                            CIBF 2026 <span className="text-blue-800">Admin Portal</span>
                        </h1>
                    </div>
                </div>


                {/* RIGHT: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">

                    {/* Quick Nav Icons */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavIconBtn
                            icon={<HomeIcon className="w-5 h-5" />}
                            label="Dashboard"
                            onClick={() => navigate("/admin/dashboard")}
                            active={location.pathname === "/admin/dashboard"}
                        />
                        <NavIconBtn
                            icon={<BuildingStorefrontIcon className="w-5 h-5" />}
                            label="Stalls"
                            onClick={() => navigate("/admin/stalls")}
                            active={location.pathname === "/admin/stalls"}
                        />
                        <NavIconBtn
                            icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
                            label="Reservations"
                            onClick={() => navigate("/admin/reservations")}
                            active={location.pathname === "/admin/reservations"}
                        />
                        <NavIconBtn
                            icon={<UsersIcon className="w-5 h-5" />}
                            label="Users"
                            onClick={() => navigate("/admin/users")}
                            active={location.pathname === "/admin/users"}
                        />
                    </div>


                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-100 rounded-full transition border border-slate-200"
                        >
                            <div className="w-9 h-9 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                                {username?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="hidden sm:block text-left">
                                <span className="block text-xs font-bold text-slate-800 leading-tight">{username}</span>
                                <span className="block text-[10px] text-slate-400 uppercase tracking-wide">{role}</span>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-150">
                                <div className="px-4 py-2 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-800">{username}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MENU DROPDOWN */}
            {isMenuOpen && (
                <>
                    {/* Overlay to close menu when clicking outside */}
                    <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsMenuOpen(false)}></div>

                    <div className="absolute top-full left-4 sm:left-8 mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl py-4 px-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Admin Navigation</p>
                        <MenuLink
                            icon={<HomeIcon className="w-5 h-5" />}
                            label="Dashboard"
                            onClick={() => { navigate("/admin/dashboard"); setIsMenuOpen(false); }}
                            active={location.pathname === "/admin/dashboard"}
                        />
                        <MenuLink
                            icon={<BuildingStorefrontIcon className="w-5 h-5" />}
                            label="Stall Management"
                            onClick={() => { navigate("/admin/stalls"); setIsMenuOpen(false); }}
                            active={location.pathname === "/admin/stalls"}
                        />
                        <MenuLink
                            icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
                            label="Reservations"
                            onClick={() => { navigate("/admin/reservations"); setIsMenuOpen(false); }}
                            active={location.pathname === "/admin/reservations"}
                        />
                        <MenuLink
                            icon={<UsersIcon className="w-5 h-5" />}
                            label="User Management"
                            onClick={() => { navigate("/admin/users"); setIsMenuOpen(false); }}
                            active={location.pathname === "/admin/users"}
                        />
                    </div>
                </>
            )}
        </nav>
    );
};

// Helper component for menu items
const MenuLink = ({ icon, label, onClick, active = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${active
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
    >
        {icon}
        {label}
    </button>
);

// Icon nav button — shows icon + small label, highlights active route
const NavIconBtn = ({ icon, label, onClick, active = false }) => (
    <button
        onClick={onClick}
        title={label}
        className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-semibold transition
            ${active
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
    >
        {icon}
        <span className="text-[10px]">{label}</span>
    </button>
);

export default AdminHeader;
