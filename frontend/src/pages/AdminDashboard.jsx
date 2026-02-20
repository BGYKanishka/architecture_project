import { Link } from "react-router-dom";
import AdminHeader from "../components/common/AdminHeader";
import {
    BuildingStorefrontIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

const cards = [
    {
        to: "/admin/stalls",
        title: "Stall Management",
        desc: "Create stalls, update status and size.",
        icon: <BuildingStorefrontIcon className="w-7 h-7" />,
        color: "bg-blue-100 text-blue-700",
    },
    {
        to: "/admin/reservations",
        title: "Reservation Monitoring",
        desc: "View reservations, QR codes and details.",
        icon: <ClipboardDocumentListIcon className="w-7 h-7" />,
        color: "bg-violet-100 text-violet-700",
    },
    {
        to: "/admin/users",
        title: "User Management",
        desc: "Add, edit, delete and manage user accounts.",
        icon: <UsersIcon className="w-7 h-7" />,
        color: "bg-emerald-100 text-emerald-700",
    },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminHeader />

            {/* Cards */}
            <div className="max-w-6xl mx-auto px-4 py-[10%] grid md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.to}
                        to={card.to}
                        className="bg-white rounded-2xl shadow p-6 md:p-8 md:min-h-112 hover:shadow-md transition flex flex-col items-center justify-center text-center gap-4 group"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                            {card.icon}
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition">
                            {card.title}
                        </h2>
                        <p className="text-sm text-slate-500">{card.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
