import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protects routes based on login & role.
 * @param {ReactNode} children - The component to render
 * @param {string[]} allowedRoles - Array of roles allowed to access (e.g. ['admin'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoggedIn } = useAuth();

  // ⏳ Step 1: Wait for AuthContext initialization
  // (user is undefined during localStorage hydration)
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // 🔒 Step 2: Not logged in → redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Step 3: Logged in but lacks role permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Step 4: Authorized → render child routes
  return children;
};

export default ProtectedRoute;
