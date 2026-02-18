import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../services/employee/service";
import HallMap from "./HallMap";
import HallShapeWrapper from "./HallShapeWrapper";

// Reusing Layouts from StallMap (Duplicated for isolation as per plan)
const hallLayouts = {
    "Hall A": [
        { top: "6%", left: "36%" },
        { top: "6%", left: "50%" }, { top: "6%", left: "64%" }, { top: "15%", left: "75%" }, { top: "35%", left: "93%" },
        { top: "50%", left: "93%" },
        { top: "65%", left: "93%" }, { top: "80%", left: "77%" },
        { top: "80%", left: "23%" }, { top: "65%", left: "8%" },
        { top: "50%", left: "8%" }, { top: "35%", left: "8%" },

        // Center Block
        { top: "35%", left: "36%" }, { top: "35%", left: "64%" },
        { top: "63%", left: "64%" }, { top: "63%", left: "36%" }, { top: "35%", left: "50%" },
        { top: "49%", left: "50%" }, { top: "49%", left: "64%" }, { top: "49%", left: "36%" }
    ],
    "Hall B": [
        { top: "10%", left: "50%" }, { top: "20%", left: "75%" }, { top: "37%", left: "50%" }, { top: "73%", left: "75%" },
        { top: "65%", left: "50%" }, { top: "90%", left: "50%" }, { top: "73%", left: "25%" }, { top: "20%", left: "25%" }
    ],
    "Hall C": [
        { top: "10%", left: "80%" },
        { top: "5%", left: "5%" }, { top: "20%", left: "5%" }, { top: "35%", left: "5%" }, { top: "50%", left: "5%" }, { top: "65%", left: "5%" },
        { top: "30%", left: "80%" }, { top: "50%", left: "80%" }, { top: "70%", left: "80%" }, { top: "90%", left: "80%" }, { top: "90%", left: "60%" }, { top: "90%", left: "40%" }
    ],
    "Hall D": [
        { top: "10%", left: "20%" },
        { top: "5%", left: "95%" }, { top: "20%", left: "95%" }, { top: "35%", left: "95%" }, { top: "50%", left: "95%" }, { top: "65%", left: "95%" },
        { top: "30%", left: "20%" }, { top: "50%", left: "20%" }, { top: "70%", left: "20%" }, { top: "90%", left: "20%" }, { top: "90%", left: "40%" }, { top: "90%", left: "60%" }
    ],
    "Hall E": [
        { top: "20%", left: "20%" }, { top: "20%", left: "80%" }, { top: "20%", left: "50%" }, { top: "80%", left: "20%" }, { top: "80%", left: "80%" }
    ],
    "Hall F": [
        { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
        { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
        { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
    ],
    "Hall G": [
        { top: "15%", left: "10%" }, { top: "15%", left: "30%" }, { top: "15%", left: "50%" }, { top: "15%", left: "70%" }, { top: "15%", left: "90%" },
        { top: "45%", left: "10%" }, { top: "45%", left: "30%" }, { top: "45%", left: "50%" }, { top: "45%", left: "70%" }, { top: "45%", left: "90%" },
        { top: "75%", left: "10%" }, { top: "75%", left: "30%" }, { top: "75%", left: "50%" }, { top: "75%", left: "70%" }, { top: "75%", left: "90%" }
    ]
};

const hallDoors = {
    "Hall A": [{ label: "Entrance", top: "92%", left: "50%" }, { label: "Exit", top: "15%", left: "23%" }],
    "Hall B": [{ label: "Entrance", top: "50%", left: "5%" }, { label: "Exit", top: "50%", left: "95%" }],
    "Hall C": [{ label: "Entrance", top: "83%", left: "15%" }, { label: "Exit", top: "5%", left: "50%" }],
    "Hall D": [{ label: "Entrance", top: "80%", left: "80%" }, { label: "Exit", top: "5%", left: "50%" }],
    "Hall E": [{ label: "Entrance", top: "90%", left: "50%" }, { label: "Exit", top: "50%", left: "95%" }],
    "Hall F": [{ label: "Entrance", top: "5%", left: "50%" }, { label: "Exit", top: "95%", left: "50%" }],
    "Hall G": [{ label: "Entrance", top: "5%", left: "50%" }, { label: "Exit", top: "95%", left: "50%" }]
};

const EmployeeStallMap = ({ hallName }) => {
    const navigate = useNavigate();
    const [stalls, setStalls] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch stalls using Employee API (which includes status details)
    useEffect(() => {
        employeeService.getEmployeeStalls()
            .then((res) => {
                setStalls(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading stalls:", err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (stall) => {
        // Green (Available), Yellow (Reserved/Pending), Red (Paid)
        // Based on requirements:
        // Green -> Available
        // Yellow -> Pending
        // Red -> Reserved / Paid

        if (!stall.reserved) return "bg-green-500 border-green-700 text-white"; // Available

        // If reserved, check payment status
        if (stall.paymentStatus === 'PAID') {
            return "bg-red-600 border-red-800 text-white"; // Paid
        } else {
            return "bg-yellow-400 border-yellow-600 text-black"; // Pending / Reserved but not paid
        }
    };

    const activeFloorStalls = hallName
        ? stalls
            .filter((s) => s.floorName === hallName.replace("Hall ", ""))
            .sort((a, b) => a.stallCode.localeCompare(b.stallCode))
        : [];

    const currentLayout = hallLayouts[hallName];

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full h-full relative">
            {/* Doors */}
            {hallDoors[hallName]?.map((door, idx) => (
                <div
                    key={`door-${idx}`}
                    className="absolute px-2 py-1 bg-gray-700 text-white text-[10px] font-bold rounded shadow-md border border-white z-40 cursor-default"
                    style={{ top: door.top, left: door.left, transform: "translate(-50%, -50%)" }}
                >
                    {door.label}
                </div>
            ))}

            {activeFloorStalls.map((stall, index) => {
                const pos = currentLayout && currentLayout[index] ? currentLayout[index] : {};
                const colorClass = getStatusColor(stall);

                return (
                    <div
                        key={stall.stallId}
                        className={`group absolute rounded-lg flex flex-col items-center justify-center cursor-help transition-all duration-300 border-2 shadow-sm ${colorClass}`}
                        style={{
                            top: pos.top,
                            left: pos.left,
                            width: stall.stallSize === 'LARGE' ? "14%" : stall.stallSize === 'MEDIUM' ? "12%" : "10%",
                            height: stall.stallSize === 'LARGE' ? "14%" : stall.stallSize === 'MEDIUM' ? "12%" : "10%",
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        <span className="font-bold text-sm leading-none">{stall.stallCode.split("-")[1]}</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-black text-white text-xs rounded p-2 z-50 shadow-lg">
                            <p><strong>Code:</strong> {stall.stallCode}</p>
                            <p><strong>Status:</strong> {stall.reserved ? (stall.paymentStatus || 'Reserved') : 'Available'}</p>
                            {stall.reserved && (
                                <>
                                    <hr className="my-1 border-gray-600" />
                                    <p><strong>Vendor:</strong> {stall.vendorName || 'N/A'}</p>
                                    {/* <p><strong>Email:</strong> {stall.vendorEmail}</p> */}
                                    <p><strong>Payment:</strong> {stall.paymentStatus || 'Pending'}</p>
                                    <p><strong>Amount:</strong> {stall.paymentAmount || stall.price}</p>
                                    {stall.paymentDate && <p><strong>Date:</strong> {new Date(stall.paymentDate).toLocaleDateString()}</p>}
                                </>
                            )}
                            {!stall.reserved && <p><strong>Price:</strong> {stall.price}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EmployeeStallMap;
