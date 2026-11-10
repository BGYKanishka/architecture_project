import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch (e) { }

    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const isAdmin = roles.includes("ROLE_ADMIN") || user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

    if (!token || !user || !isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
