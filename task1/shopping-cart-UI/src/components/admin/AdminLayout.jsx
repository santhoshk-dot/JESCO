import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Menu, LogOut, Package, Users, Home, ShoppingBag } from "lucide-react";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin" },
    { name: "Products", icon: <Package size={18} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingBag size={18} />, path: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1
            className={`font-bold text-lg ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 mx-3 my-1 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <p className="text-sm text-gray-500 mb-2">
              Logged in as <span className="font-medium">{user?.name}</span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
          >
            <LogOut size={18} /> {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
