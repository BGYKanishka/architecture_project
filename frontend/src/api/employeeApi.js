import api from "./axiosConfig";

const verifyQR = (qrContent) => {
    return api.post("/employee/verify-qr", { qrContent });
};

const EmployeeService = {
    verifyQR,
};

export default EmployeeService;
