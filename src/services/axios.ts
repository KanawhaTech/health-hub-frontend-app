import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const CONTENT_TYPE = "application/json";
const ACCEPT = "application/json";
const DATASOURCE = "develop";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:3000/api",
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Add Bearer token if available (adjust based on your auth implementation)
  const token = localStorage.getItem("token"); // or use your auth state management
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // Return the data directly
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error?.response?.data || error);
  }
);

// Set default headers
api.defaults.headers.post["Content-Type"] = CONTENT_TYPE;
api.defaults.headers.common["Accept"] = ACCEPT;

if (process.env.NODE_ENV !== "production") {
  api.defaults.headers.common["x-Data-Source"] = DATASOURCE;
}

export default api;
