import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("auth/token/")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      isRefreshing = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;