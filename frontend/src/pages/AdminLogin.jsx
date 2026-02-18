import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/admin/admin.auth.service";

export default function AdminLogin() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const data = await adminLogin(username, password);

            const role = data.roles && data.roles.length > 0 ? data.roles[0] : "";

            if (role !== "ROLE_ADMIN" && role !== "ROLE_EMPLOYEE") {
                setErr("Access denied. Admin or Employee privileges required.");
                setLoading(false);
                return;
            }

            localStorage.setItem("admin_token", data.token);
            localStorage.setItem("admin_role", role);
            localStorage.setItem("admin_username", data.email);

            nav("/admin/dashboard");
        } catch (e2) {
            setErr("Login failed. Check username/password OR role not allowed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
                <h1 className="text-2xl font-bold text-slate-900">Admin / Employee Login</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Sinhala: Admin/Employee
                </p>

                {err && (
                    <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                        {err}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={submit}>
                    <div>
                        <label className="text-sm text-slate-700">Username</label>
                        <input
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
