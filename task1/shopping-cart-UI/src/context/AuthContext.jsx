import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // 🔹 Load from localStorage on first mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // 🔹 Login handler
  const login = useCallback((userData, jwtToken) => {
    if (!userData || !jwtToken) return;

    // Normalize and ensure defaults
    const normalizedUser = {
      _id: userData._id || userData.id || null,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "user",
      ...userData,
    };

    // Persist to localStorage
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", jwtToken);

    // Set state
    setUser(normalizedUser);
    setToken(jwtToken);
  }, []);

  // 🔹 Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // 🔹 Derived states
  const isLoggedIn = !!token && !!user?._id;
  const isAdmin = user?.role === "admin";

  // 🔹 Memoize context value
  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn,
      isAdmin,
      login,
      logout,
    }),
    [user, token, isLoggedIn, isAdmin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for cleaner access
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
