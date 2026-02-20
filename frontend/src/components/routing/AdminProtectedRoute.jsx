import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    try { user = userStr ? JSON.parse(userStr) : null; } catch (e) { }

    const role = user?.roles ? user.roles[0] : null;

    if (!token || !user || role !== "ROLE_ADMIN") {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
