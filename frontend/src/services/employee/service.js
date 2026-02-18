import axios from "axios";
// Removed invalid import




const API_URL = "http://localhost:8080/api/employees";
const EMPLOYEE_PANEL_API_URL = "http://localhost:8080/api/employee";

const verifyQR = (qrData) => {
    return axios.post(`${API_URL}/verify-qr`, qrData);
};

const getEmployeeStalls = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${EMPLOYEE_PANEL_API_URL}/stalls`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
};

export default { verifyQR, getEmployeeStalls };