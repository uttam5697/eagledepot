import axios from "axios";
import { env } from "../config/env";

// Axios instance
const api = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "x-xsrf-token",
});

const refreshApi = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["Accept"] = "application/json";
  return config;
});

// Response interceptor with refresh + retry logic
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const message = error.response?.data?.message || error?.message;
    console.warn("[API Error]", message);

    // If 401 and not already retried, try refresh
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth_service/auth/refresh-token")
    ) {
      original._retry = true;

      try {
        // Attempt refresh
        await refreshApi.post("/auth_service/auth/refresh-token");

        // Retry original request with updated cookies
        return api(original);
      } catch (refreshError) {
        console.error("[Token refresh failed]", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
