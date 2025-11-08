import axios from "axios";

// ✅ Use environment variable for API base URL (fallback for local dev)
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

// 🧱 Public GET routes — accessible without a token
const PUBLIC_GET_ENDPOINTS = [
  "/products",
  "/categories",
  "/brands",
  "/auth/login",
  "/auth/signup",
  "/contact",
  "/about",
];

// ✅ Request Interceptor — attach JWT only for protected routes
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      // Determine if route should skip token
      const isPublicGet =
        config.method?.toUpperCase() === "GET" &&
        PUBLIC_GET_ENDPOINTS.some((url) => config.url.includes(url)); // ✅ use .includes() instead of .startsWith()

      // Attach JWT only if it's a protected route
      if (token && !isPublicGet) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 🔍 Debug log (you can remove later)
      console.log("🔹 AXIOS DEBUG:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
        isPublicGet,
        headers: config.headers,
      });
    } catch (err) {
      console.warn("⚠️ Failed to attach token:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — centralized error handling
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

    // 🚫 403 → Forbidden
    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    // 🔥 5xx → Server Error
    if (status >= 500) {
      console.error("🔥 Server Error:", error.response);
    }

    return Promise.reject(error);
  }
);

export default api;
