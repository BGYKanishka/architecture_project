import { Link } from "react-router-dom";
import AdminHeader from "../../components/common/AdminHeader";
import {
    BuildingStorefrontIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const cards = [
    {
        to: "/admin/stalls",
        title: "Stall Management",
        desc: "Inspect live hall inventory, view pricing and dimensions, manage vendor allocations, and toggle stall availability.",
        icon: <BuildingStorefrontIcon className="w-6 h-6 text-indigo-400" />,
        section: "Floor Layouts",
    },
    {
        to: "/admin/reservations",
        title: "Reservation Monitoring",
        desc: "Inspect real-time bookings, verify attendee QR tokens, audit payment confirmations, and review allocated spaces.",
        icon: <ClipboardDocumentListIcon className="w-6 h-6 text-indigo-400" />,
        section: "Live Bookings",
    },
    {
        to: "/admin/users",
        title: "User Management",
        desc: "Manage vendor accounts, adjust employee roles, enforce access controls, and view registered publishers.",
        icon: <UsersIcon className="w-6 h-6 text-indigo-400" />,
        section: "Accounts & Roles",
    },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
            <AdminHeader />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {/* Clean Header */}
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                        Administration Console
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        CIBF 2026 Operations
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                        Centralized management for exhibition halls, live stall inventory, vendor bookings, and system credentials.
                    </p>
                </div>

                {/* Quick Action Navigation Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Link
                            key={card.to}
                            to={card.to}
                            className="bg-[#0f1422] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                                        {card.icon}
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {card.section}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {card.title}
                                </h2>
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                                <span>Open console</span>
                                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
