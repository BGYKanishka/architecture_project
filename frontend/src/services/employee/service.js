import api from "../api";

const getEmployeeStalls = () => {
    return api.get("/employee/stalls");
};

const getStallDetails = (stallId) => {
    return api.get(`/employee/stalls/${stallId}`);
};

export default { getEmployeeStalls, getStallDetails };
