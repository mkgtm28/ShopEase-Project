import axiosClient from "./axiosClient";

const API_URL = "wishlist/";

export const getWishlist = async () => {
  const response = await axiosClient.get(API_URL);

  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axiosClient.post(
    API_URL,
    {
      product: productId,
    }
  );

  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await axiosClient.delete(
    `${API_URL}${wishlistId}/`
  );

  return response.data;
};