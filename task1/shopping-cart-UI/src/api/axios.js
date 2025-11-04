import axios from "axios";

// ✅ Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("🔍 API Base URL:", API_BASE_URL);


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor — attach JWT automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("⚠️ Failed to attach token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("🚨 Network/Server unreachable:", error);
      alert("Server not reachable. Please try again later.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Unauthorized → token expired / invalid
    if (status === 401) {
      console.warn("⚠️ Unauthorized! Clearing token and redirecting...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    if (status >= 500) {
      console.error("🔥 Server Error:", error.response);
    }

    return Promise.reject(error);
  }
);

export default api;
