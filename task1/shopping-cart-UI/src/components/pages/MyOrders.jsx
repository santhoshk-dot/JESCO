import React, { useEffect, useState } from "react";
import api from "../../api/axios";
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/me");
        setOrders(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // 🧾 Download invoice PDF
  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: "blob", // Important for PDF binary data
      });

      // Create file blob & trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice-${orderId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("❌ Error downloading invoice:", err);
      alert("Failed to download invoice. Please try again later.");
    }
  };
console.log(API_BASE_URL)
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
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-700 font-semibold">
                  Order ID:{" "}
                  <span className="text-gray-600 font-normal">{order._id}</span>
                </p>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  Placed on:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                <div
                  className={`${
                    order.status?.toLowerCase() === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } text-sm font-medium px-4 py-1.5 rounded-full`}
                >
                  {order.status ? order.status.toUpperCase() : "PLACED"}
                </div>

                {/* 🧾 Invoice Button */}
                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  <FaFileInvoice />
                  Invoice
                </button>

                <button
                  onClick={() => toggleOrder(order._id)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  {expandedOrder === order._id ? (
                    <>
                      Hide Details <FaChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      View Details <FaChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dropdown Details */}
            {expandedOrder === order._id && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 animate-dropdown">
                {/* Address */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" /> Delivery Address
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.deliveryAddress?.address},{" "}
                    {order.deliveryAddress?.city},{" "}
                    {order.deliveryAddress?.state} -{" "}
                    {order.deliveryAddress?.zip},{" "}
                    {order.deliveryAddress?.country}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ordered Items
                  </h4>
                  <div className="bg-white rounded-lg border border-gray-200 divide-y">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.qty} × ₹{item.price}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{item.qty * item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-4 text-sm text-gray-700">
                  <p>Subtotal: ₹{order.subtotal}</p>
                  {order.discount > 0 && (
                    <p className="text-green-600">
                      Discount: ₹{order.discount}
                    </p>
                  )}
                  <p className="font-semibold text-gray-900 text-base">
                    Total: ₹{order.total}
                  </p>
                </div>

                {/* Delivery Date */}
                {order.deliveryDate && (
                  <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    Expected Delivery:{" "}
                    <span className="font-medium">
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                )}

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

      <style>
        {`
          @keyframes dropdown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-dropdown {
            animation: dropdown 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default MyOrders;
