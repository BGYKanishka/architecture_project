import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");

    if (!token || (role !== "ROLE_ADMIN" && role !== "ROLE_EMPLOYEE")) {
        // Not authenticated or not an admin/employee
        return <Navigate to="/admin/login" replace />;
    }

    // Authenticated
    return <Outlet />;
}
