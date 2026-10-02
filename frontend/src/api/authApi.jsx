import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/";

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}register/`,
    userData
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(
    `${API_URL}token/`,
    credentials
  );

  return response.data;
  
};
export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${API_URL}forgot-password/`,
    { email }
  );

  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axios.post(
    `${API_URL}reset-password/`,
    data
  );

  return response.data;
};