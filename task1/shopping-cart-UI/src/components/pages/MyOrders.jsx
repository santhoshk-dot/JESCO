import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaFileInvoice,
} from "react-icons/fa";

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice-${orderId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Failed to download invoice.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <FaBoxOpen className="text-5xl mb-3 text-gray-400" />
        <p>No orders found yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h2>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
            
            {/* Header */}
            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-700 font-semibold">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </p>

                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <FaCalendarAlt /> Placed on:
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                <div
                  className={`${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } px-4 py-1.5 rounded-full text-sm font-medium`}
                >
                  {order.status?.toUpperCase()}
                </div>

                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                  <FaFileInvoice /> Invoice
                </button>

                <button
                  onClick={() => toggleOrder(order._id)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg"
                >
                  {expandedOrder === order._id ? (
                    <>Hide Details <FaChevronUp size={14} /></>
                  ) : (
                    <>View Details <FaChevronDown size={14} /></>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order._id && (
              <div className="p-6 bg-gray-50 border-t animate-dropdown">
                
                {/* Address */}
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                  <FaMapMarkerAlt /> Delivery Address
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} - {order.deliveryAddress.zip},{" "}
                  {order.deliveryAddress.country}
                </p>

                {/* Items */}
                <h4 className="font-semibold text-gray-800 mb-2">Ordered Items</h4>
                <div className="bg-white border rounded-lg divide-y">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.qty} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold">₹{item.qty * item.price}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 text-sm text-gray-700">
                  <p>Subtotal: ₹{order.subtotal}</p>
                  {order.discount > 0 && (
                    <p className="text-green-600">Discount: ₹{order.discount}</p>
                  )}
                  <p className="font-semibold text-gray-900 text-base">
                    Total: ₹{order.total}
                  </p>
                </div>

                {/* Delivery date */}
                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt />
                  Expected Delivery:{" "}
                  <span className="font-medium">
                    {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
                  </span>
                </div>

                {/* Notes */}
                {order.orderNotes && (
                  <p className="mt-3 text-sm italic text-gray-500">
                    Note: {order.orderNotes}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
