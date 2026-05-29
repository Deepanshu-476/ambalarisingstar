import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  // baseURL: import.meta.env.VITE_API_URL || "https://backend.cdspremierleague.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // // Separate constants for image URL
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:4000";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
// export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || "https://backend.cdspremierleague.com";
// export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://backend.cdspremierleague.com/api";
// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 [AXIOS] Token added to ${config.url}`);
    } else {
      console.warn(`⚠️ [AXIOS] No token found for ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [AXIOS] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ [AXIOS] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${
        error.response?.status || "Network Error"
      }`
    );

    if (error.response) {
      console.error("📊 [AXIOS] Error response:", error.response.data);

      // Auto logout on 401
      if (error.response.status === 401) {
        console.log("🔒 [AXIOS] 401 Unauthorized - Logging out");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      console.error("🌐 [AXIOS] Network error - No response received");
    } else {
      console.error("⚡ [AXIOS] Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;