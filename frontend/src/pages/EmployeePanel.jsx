import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';
import employeeService from '../services/employee.service';

const EmployeePanel = () => {
    const [employee, setEmployee] = useState(null);

    const handleScan = (decodedText) => {
        employeeService.verifyQR(decodedText)
            .then(res => setEmployee(res.data))
            .catch(err => alert("Employee not found!"));
    };

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

export default EmployeePanel;