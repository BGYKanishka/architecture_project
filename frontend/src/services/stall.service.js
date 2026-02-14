import api from "./api";

const getAllStalls = () => {
  return api.get("/stalls");
};

const reserveStalls = (stallIds) => {
  return api.post("/vendor-publishers/reservations", { stallIds });
};

const StallService = {
  getAllStalls,
  reserveStalls,
};

export default StallService;