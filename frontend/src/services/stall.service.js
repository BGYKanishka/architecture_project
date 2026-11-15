import api from "./api";

const getAllStalls = () => {
  return api.get("/stalls");
};

const reserveStalls = (stallIds, paymentMethod = "CASH_ON_DATE") => {
  const payload = Array.isArray(stallIds)
    ? { stallIds, paymentMethod }
    : { paymentMethod: "CASH_ON_DATE", ...stallIds };
  return api.post("/vendor-publishers/reservations", payload);
};

const getReservationCount = () => {
  return api.get("/vendor-publishers/reservations/count");
};

const getMyReservations = () => {
  return api.get("/vendor-publishers/reservations/my");
};

const cancelReservation = (stallId) => {
  return api.delete(`/vendor-publishers/reservations/${stallId}`);
};

const StallService = {
  getAllStalls,
  reserveStalls,
  getReservationCount,
  getMyReservations,
  cancelReservation,
};

export default StallService;