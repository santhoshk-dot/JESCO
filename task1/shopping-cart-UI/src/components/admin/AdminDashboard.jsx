import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, ShoppingBag, Package, IndianRupee, Loader2, TrendingUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get("/users"),
          api.get("/orders"),
          api.get("/products"),
        ]);

        const totalUsers = usersRes.data.length;
        const totalOrders = ordersRes.data.length;
        const totalRevenue = ordersRes.data.reduce(
          (acc, order) => acc + (order.total || 0),
          0
        );
        const totalProducts = productsRes.data.length;

        setStats({ totalUsers, totalOrders, totalRevenue, totalProducts });
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading analytics...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="text-blue-500 w-6 h-6" />,
      color: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag className="text-green-500 w-6 h-6" />,
      color: "bg-green-100 dark:bg-green-900/40",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee className="text-yellow-500 w-6 h-6" />,
      color: "bg-yellow-100 dark:bg-yellow-900/40",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package className="text-purple-500 w-6 h-6" />,
      color: "bg-purple-100 dark:bg-purple-900/40",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`${card.color} rounded-xl p-5 flex items-center justify-between shadow hover:shadow-lg transition-all duration-300`}
          >
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {card.title}
              </p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Optional Chart Placeholder */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Overview</h2>
          <TrendingUp className="text-green-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Coming soon — chart with monthly order & revenue trends 📈
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
