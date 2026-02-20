import { Navigate } from "react-router-dom";

/**
 * Route guard for EMPLOYEE-only pages.
 * Reads the stored user from localStorage and checks for ROLE_EMPLOYEE.
 * Redirects to /login if not authenticated or wrong role.
 */
const EmployeeRoute = ({ children }) => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (!roles.includes("ROLE_EMPLOYEE")) {
            return <Navigate to="/login" replace />;
        }
    } catch {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default EmployeeRoute;
