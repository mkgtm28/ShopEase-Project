import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/products/";

export const getProducts = async (
  search = "",
  category = "",
  ordering = "",
  page = 1
) => {
  const response = await axios.get(API_URL, {
    params: {
      search,
      category,
      ordering,
      page,
    },
  });

  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}${id}/`);
  return response.data;
};