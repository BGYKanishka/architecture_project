import { Navigate } from "react-router-dom";


const EmployeeRoute = ({ children, user, authLoading }) => {
    if (authLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const isEmployee = roles.includes("ROLE_EMPLOYEE") || user.role === "EMPLOYEE" || user.role === "ROLE_EMPLOYEE";
    if (!isEmployee) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default EmployeeRoute;
