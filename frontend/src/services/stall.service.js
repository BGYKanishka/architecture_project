import api from "./api";

const getAllStalls = () => {
  return api.get("/stalls");
};

const reserveStalls = (stallIds) => {
  return api.post("/vendor-publishers/reservations", { stallIds });
};

const getReservationCount = () => {
  return api.get("/vendor-publishers/reservations/count");
};

const StallService = {
  getAllStalls,
  reserveStalls,
  getReservationCount,
};

export default StallService;