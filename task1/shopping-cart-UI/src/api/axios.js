import axios from "axios";

// ✅ Use environment variable for API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://jesco.onrender.com";
console.log("🔍 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧱 Define public routes (GET doesn’t need token)
const PUBLIC_ENDPOINTS = [
  "/products",
  "/categories",
  "/brands",
  "/auth/login",
  "/auth/signup",
  "/contact",
  "/about",
];

// ✅ Request Interceptor — attach JWT only for protected APIs
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      const isPublic = PUBLIC_ENDPOINTS.some((url) =>
        config.url.startsWith(url)
      );

      // ✅ Only attach token for protected routes
      if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("⚠️ Failed to attach token:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("🚨 Network/Server unreachable:", error);
      alert("Server not reachable. Please try again later.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 🔒 401 → Token expired or invalid
    if (status === 401) {
      console.warn("⚠️ Unauthorized! Token invalid/expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid infinite redirect loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // 🚫 Forbidden (403)
    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    // 🔥 Server Errors
    if (status >= 500) {
      console.error("🔥 Server Error:", error.response);
    }

    return Promise.reject(error);
  }
);

export default api;
