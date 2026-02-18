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

    return (
        <div className="min-h-screen bg-slate-50">
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

            <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-4">
                <Link
                    to="/admin/stalls"
                    className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
                >
                    <h2 className="text-lg font-semibold">Stall Management</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Create stalls, update status/size.
                    </p>
                </Link>

                <Link
                    to="/admin/reservations"
                    className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
                >
                    <h2 className="text-lg font-semibold">Reservation Monitoring</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        View reservations and details (QR + stalls).
                    </p>
                </Link>

                <Link
                    to="/admin/duties"
                    className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
                >
                    <h2 className="text-lg font-semibold">Duty Management</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Assign and manage duties for employees.
                    </p>
                </Link>
            </div>
        </div>
    );
}
