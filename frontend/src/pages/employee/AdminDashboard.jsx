import React, { useState, useCallback } from 'react';
import QRScanner from '../../components/map/QRScanner';
import EmployeeService from '../../api/employeeApi';

const AdminDashboard = () => {
    const [employee, setEmployee] = useState(null);

    const handleScan = useCallback((decodedText) => {
        EmployeeService.verifyQR(decodedText)
            .then(res => setEmployee(res.data))
            .catch(() => alert("Employee not found!"));
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Employee Panel - QR Verification</h2>
            {!employee ? (
                <QRScanner onScanSuccess={handleScan} />
            ) : (
                <div style={{ marginTop: '20px', border: '1px solid green', padding: '10px' }}>
                    <h3>Welcome, {employee.name}!</h3>
                    <p>Designation: {employee.designation}</p>
                    <button onClick={() => setEmployee(null)}>Scan Again</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;