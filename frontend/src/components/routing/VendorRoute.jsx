import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../services/auth.service";

const VendorRoute = ({ children, user: propUser, authLoading }) => {
    const user = propUser || AuthService.getCurrentUser();

    if (authLoading && !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0b0f19] text-slate-400 text-xs">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const roleUpper = String(user?.role || "").toUpperCase();
    const isAdmin = roles.includes("ROLE_ADMIN") || roleUpper === "ADMIN" || roleUpper === "ROLE_ADMIN";
    const isEmployee = roles.includes("ROLE_EMPLOYEE") || roleUpper === "EMPLOYEE" || roleUpper === "ROLE_EMPLOYEE";

    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (isEmployee) {
        return <Navigate to="/employee/floor-plan" replace />;
    }

    return children ? children : <Outlet />;
};

export default VendorRoute;
