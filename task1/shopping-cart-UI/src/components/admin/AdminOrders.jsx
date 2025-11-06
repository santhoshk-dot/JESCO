import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders"); // Adjust API path if needed
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border-b">Order ID</th>
                <th className="p-2 text-left border-b">Customer</th>
                <th className="p-2 text-left border-b">Total</th>
                <th className="p-2 text-left border-b">Status</th>
                <th className="p-2 text-left border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{order._id}</td>
                  <td className="p-2 border-b">{order.user?.name || "Guest"}</td>
                  <td className="p-2 border-b">₹{order.totalAmount}</td>
                  <td className="p-2 border-b">{order.status}</td>
                  <td className="p-2 border-b">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
