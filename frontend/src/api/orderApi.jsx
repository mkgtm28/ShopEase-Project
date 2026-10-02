import axiosClient from "./axiosClient";

const API_URL = "orders/";

export const createOrder = async (orderData) => {
  const response = await axiosClient.post(
    API_URL,
    orderData
  );

  return response.data;
};

export const getOrders = async () => {
  const response = await axiosClient.get(API_URL);

  return response.data;
};

export const getOrder = async (id) => {
  const response = await axiosClient.get(
    `${API_URL}${id}/`
  );

  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await axiosClient.patch(
    `${API_URL}${id}/cancel/`
  );

  return response.data;
};