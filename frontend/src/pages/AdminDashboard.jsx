import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../services/admin/admin.auth.service";

export default function AdminDashboard() {
    const nav = useNavigate();
    const username = localStorage.getItem("admin_username") || "Admin";
    const role = localStorage.getItem("admin_role") || "";

    const logout = () => {
        adminLogout();
        nav("/admin/login");
    };

    const cards = [
        {
            to: "/admin/stalls",
            title: "Stall Management",
            desc: "Create stalls, update status and size.",
            icon: "🏪",
        },
        {
            to: "/admin/reservations",
            title: "Reservation Monitoring",
            desc: "View reservations, QR codes and details.",
            icon: "📋",
        },
        {
            to: "/admin/users",
            title: "User Management",
            desc: "Add, edit, delete and manage user accounts.",
            icon: "👥",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
                        <p className="text-sm text-slate-500">{username} • {role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.to}
                        to={card.to}
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition flex flex-col gap-2"
                    >
                        <span className="text-3xl">{card.icon}</span>
                        <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                        <p className="text-sm text-slate-500">{card.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
