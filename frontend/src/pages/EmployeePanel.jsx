import React, { useState, useCallback } from 'react';
import QRScanner from '../components/shared/QRScanner';
import employeeService from '../services/employee/service';
import ConfirmationModal from '../components/common/ConfirmationModal';

const EmployeePanel = () => {
    const [employee, setEmployee] = useState(null);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: ""
    });

    const showAlert = (title, message) => {
        setAlertConfig({ isOpen: true, title, message });
    };

    const handleScan = useCallback((decodedText) => {
        employeeService.verifyQR(decodedText)
            .then(res => setEmployee(res.data))
            .catch(() => showAlert("Not Found", "Employee not found!"));
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

            <ConfirmationModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText="Got it"
                isAlert={true}
            />
        </div>
    );
};

export default EmployeePanel;