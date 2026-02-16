import api from "./api";

const getProfile = () => {
  return api.get("/user/profile");
};

const updateProfile = (data) => {
  return api.put("/user/profile", data);
};

const changePassword = (data) => {
  return api.post("/user/change-password", data);
};

const UserService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default UserService;
