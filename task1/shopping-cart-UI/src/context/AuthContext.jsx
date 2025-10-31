import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load from localStorage once at startup
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // Login: normalize + persist user/token
  const login = useCallback((userData, jwtToken) => {
    if (!userData || !jwtToken) return;

    const normalizedUser = {
      _id: userData._id || userData.id || null,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "user",
      ...userData,
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", jwtToken);

    setUser(normalizedUser);
    setToken(jwtToken);
  }, []);

  // Logout: clear everything and redirect
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Derived state
  const isLoggedIn = !!token && !!user?._id;

  // Memoize the context to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ user, token, isLoggedIn, login, logout }),
    [user, token, isLoggedIn, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
