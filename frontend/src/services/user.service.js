import api from "./api";

const getProfile = () => {
  return api.get("/user/profile");
};

const updateProfile = (data) => {
  return api.put("/user/profile", data);
};

const UserService = {
  getProfile,
  updateProfile,
};

export default UserService;
