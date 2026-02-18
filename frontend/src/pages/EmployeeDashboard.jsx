import React, { useState } from "react";
import EmployeeStallMap from "../components/EmployeeStallMap";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const EmployeeDashboard = () => {
    const [selectedHall, setSelectedHall] = useState("Hall A");
    const navigate = useNavigate();
    const halls = ["Hall A", "Hall B", "Hall C", "Hall D", "Hall E", "Hall F", "Hall G"];

    const handleLogout = () => {
        AuthService.logout();
        navigate("/employee/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-900">Employee Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">Stall Management</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Floors / Halls</h3>
                    <div className="space-y-2">
                        {halls.map(hall => (
                            <button
                                key={hall}
                                onClick={() => setSelectedHall(hall)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${selectedHall === hall
                                        ? "bg-blue-100 text-blue-700 font-medium"
                                        : "hover:bg-gray-50 text-gray-600"
                                    }`}
                            >
                                {hall}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-semibold text-gray-800">{selectedHall} Overview</h2>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                            <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-600"></span>
                            <span>Reserved / Paid</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative overflow-auto bg-gray-50 p-8">
                    <div className="bg-white rounded-xl shadow-lg h-full p-4 relative overflow-hidden">
                        <EmployeeStallMap hallName={selectedHall} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
