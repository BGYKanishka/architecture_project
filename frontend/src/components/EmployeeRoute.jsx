import { Navigate } from "react-router-dom";


const EmployeeRoute = ({ children }) => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        const roles = Array.isArray(user.roles) ? user.roles : [];
        if (!roles.includes("ROLE_EMPLOYEE")) {
            // eslint-disable-next-line react-hooks/error-boundaries
            return <Navigate to="/login" replace />;
        }
    } catch {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default EmployeeRoute;
