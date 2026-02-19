import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeStallMap from "../components/EmployeeStallMap";

/**
 * Hall drill-down view for employees.
 * EmployeeStallMap now owns the full page layout (title, legend, Back to Map button).
 */
const EmployeeDashboard = () => {
    const { hallName: urlHall } = useParams();
    const navigate = useNavigate();
    const hallName = urlHall ? decodeURIComponent(urlHall) : "Hall A";

    return <EmployeeStallMap hallName={hallName} />;
};

export default EmployeeDashboard;
