import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, Package, Users, Home, ShoppingBag } from "lucide-react";
import { useState } from "react";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && <h1 className="font-bold text-lg">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          <NavLink to="/admin" end className="block px-4 py-2">Dashboard</NavLink>
          <NavLink to="/admin/products" className="block px-4 py-2">Products</NavLink>
          <NavLink to="/admin/orders" className="block px-4 py-2">Orders</NavLink>
          <NavLink to="/admin/users" className="block px-4 py-2">Users</NavLink>
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} /> {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Outlet renders child route */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
