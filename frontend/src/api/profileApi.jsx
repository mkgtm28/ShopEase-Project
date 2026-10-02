import axiosClient from "./axiosClient";

const API_URL = "auth/profile/";

export const getProfile = async () => {
  const response = await axiosClient.get(API_URL);

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosClient.patch(
    API_URL,
    profileData
  );

  return response.data;
};