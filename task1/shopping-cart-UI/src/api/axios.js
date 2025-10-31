import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Your backend base URL
  withCredentials: true,             // Include cookies if backend uses them
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

      // prevent redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Forbidden (no permission)
    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    // Generic server error
    if (status >= 500) {
      console.error("🔥 Server Error:", error.response);
    }

    return Promise.reject(error);
  }
);

export default api;
