import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute({ user, authLoading }) {
    if (authLoading) return null;

    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const isAdmin = roles.includes("ROLE_ADMIN") || user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

    if (!user || !isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
