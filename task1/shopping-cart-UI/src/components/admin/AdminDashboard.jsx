import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            🧭 Dashboard Home
          </Link>
          <Link
            to="/admin/products"
            className="block px-4 py-2 rounded hover:bg-gray-700"
          >
            📦 Manage Products
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
