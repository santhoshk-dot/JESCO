import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Package,
  Users,
  ShoppingBag,
  Loader2,
  BarChart3,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [productsRes, usersRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/users"),
          api.get("/orders"),
        ]);

        setStats({
          products: productsRes.data?.length || 0,
          users: usersRes.data?.length || 0,
          orders: ordersRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <p className="ml-3 text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center text-red-500">
        <AlertCircle size={40} className="mb-3" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={28} className="text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<Package size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<Users size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={<ShoppingBag size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Empty message when all counts are 0 */}
      {stats.products === 0 && stats.users === 0 && stats.orders === 0 && (
        <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No data available yet.</p>
          <p className="text-sm mt-1">
            Add some products, users, or orders to see analytics here.
          </p>
        </div>
      )}
    </div>
  );
};

/* ------------------- Reusable Stat Card ------------------- */
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-full text-white ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
