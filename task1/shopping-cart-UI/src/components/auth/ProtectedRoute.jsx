import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protects routes based on login & role.
 * @param {ReactNode} children - The component to render
 * @param {string[]} allowedRoles - Array of roles allowed to access (e.g. ['admin'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoggedIn } = useAuth();

  // 🔒 Not logged in → redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Logged in but lacks role permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ User is authorized
  return children;
};

export default ProtectedRoute;
