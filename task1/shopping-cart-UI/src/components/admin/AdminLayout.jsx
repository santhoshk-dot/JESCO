import {
  Menu,
  X,
  LogOut,
  Package,
  Users,
  Home,
  ShoppingBag,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, NavLink, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import clsx from "clsx";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle
  const [expanded, setExpanded] = useState(true); // for desktop collapse

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Auto-close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const navItems = [
    { name: "Dashboard", icon: <BarChart3 size={18} />, path: "/admin/dashboard" },
    { name: "Products", icon: <Package size={18} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingBag size={18} />, path: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
  ];

  // Breadcrumb logic
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.slice(1); // skip 'admin'

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed md:static z-30 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl transition-all duration-300",
          expanded ? "w-64" : "w-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {expanded && (
            <h1 className="font-bold text-lg tracking-wide">JESCO Admin</h1>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-300 hover:text-white hidden md:block"
          >
            <Menu size={22} />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-300 hover:text-white md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 rounded-lg mx-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {item.icon}
              {expanded && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          {expanded && (
            <div className="mb-2 text-sm text-gray-400">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "user"}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={18} />
            {expanded && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Dashboard
              </span>
              {breadcrumbs.map((segment, index) => (
                <span key={index} className="flex items-center">
                  <ChevronRight size={14} className="mx-1" />
                  <span className="capitalize">
                    {segment.replace("-", " ")}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-300">
            <span className="hidden md:inline">Welcome, </span>
            <span className="font-medium">{user?.name}</span>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6 bg-gray-50 dark:bg-gray-800 flex-1 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
