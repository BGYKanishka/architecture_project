import axios from "axios";
import employeeService from "../services/employee.service.js";


const API_URL = "http://localhost:8080/api/employees";

const verifyQR = (qrData) => {
    return axios.post(`${API_URL}/verify-qr`, qrData);
};

export default { verifyQR };