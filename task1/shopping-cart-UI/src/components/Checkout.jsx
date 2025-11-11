import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTag } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Load addresses on mount
  useEffect(() => {
    if (user?._id) fetchAddresses();
  }, [user]);

 const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch addresses:", err);
    }
  };
  // 💳 Cart Calculations
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price || 0) * i.qty,
    0
  );
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "save10") {
      const newDiscount = subtotal * 0.1;
      setDiscount(newDiscount);
      alert("✅ 10% discount applied!");
    } else {
      setDiscount(0);
      alert("❌ Invalid coupon code");
    }
  };

  // 📦 Place Order
  const handlePlaceOrder = async () => {
    if (!token || !user?._id) {
      alert("⚠️ Please log in before placing an order!");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address!");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);

    const orderData = {
      userId: user._id,
      deliveryAddress: selectedAddress,
      items: items.map((i) => ({
        productId: i.product._id || i.product.id || i.product.sku,
        name: i.product.name,
        price: Number(i.product.price),
        qty: Number(i.qty),
      })),
      orderNotes: orderNotes?.trim() || null,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
      deliveryDate: deliveryDate.toISOString(),
    };

    try {
      setLoading(true);
      const res = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201 || res.status === 200) {
        alert("🎉 Order placed successfully!");
        clearCart();
        localStorage.removeItem("selectedAddress");
        navigate("/myorders");
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      console.error("❌ Order creation failed:", err.response?.data || err.message);
      alert("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 gap-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-8">
          {/* 🏠 Delivery Address Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">📍 Delivery Address</h2>
              {/* ✅ Link to external Add Address page */}
              <Link
                to="/address/add"
                className="bg-red-400 text-white px-3 py-1 rounded-lg hover:shadow-md"
              >
                + Add New
              </Link>
            </div>

            {/* Selected Address */}
            {selectedAddress && (
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                <p className="font-semibold">{selectedAddress.label}</p>
                <p className="text-sm text-gray-600">
                  {selectedAddress.address}, {selectedAddress.city},{" "}
                  {selectedAddress.state}, {selectedAddress.zip},{" "}
                  {selectedAddress.country}
                </p>
              </div>
            )}

            {/* Dropdown Toggle */}
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-full flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
            >
              <span className="font-medium text-gray-800">
                {showDropdown ? "Hide Saved Addresses" : "Select from Saved Addresses"}
              </span>
              <span
                className={`transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {/* Dropdown List */}
            <div
              className={`mt-3 border border-gray-200 rounded-lg shadow-inner bg-white overflow-hidden ${
                showDropdown ? "animate-slideDown" : "animate-slideUp"
              }`}
              style={{ maxHeight: showDropdown ? "300px" : "0px" }}
            >
              {showDropdown && (
                <div className="max-h-60 overflow-y-auto">
                  {addresses.length > 0 ? (
                    addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedAddress(addr);
                          localStorage.setItem(
                            "selectedAddress",
                            JSON.stringify(addr)
                          );
                          setShowDropdown(false);
                        }}
                        className={`p-3 border-b cursor-pointer transition-all duration-200 ${
                          selectedAddress?._id === addr._id
                            ? "bg-red-50 border-l-4 border-red-400"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{addr.label}</p>
                            <p className="text-sm text-gray-600 leading-snug">
                              {addr.address}, {addr.city}, {addr.state},{" "}
                              {addr.zip}, {addr.country}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete this address?")) {
                                api
                                  .delete(
                                    `/users/${user._id}/addresses/${addr._id}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  )
                                  .then(() => {
                                    setAddresses((prev) =>
                                      prev.filter((a) => a._id !== addr._id)
                                    );
                                    if (selectedAddress?._id === addr._id)
                                      setSelectedAddress(null);
                                  })
                                  .catch(() =>
                                    alert("Failed to delete address.")
                                  );
                              }
                            }}
                            className="text-red-500 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-gray-500 text-sm">
                      No saved addresses yet. Please add one.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Coupon Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaTag /> Apply Coupon
            </h2>
            <div className="flex gap-3 mt-4">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 border rounded-lg px-3 py-2"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-black text-white px-4 py-2 rounded-lg hover:shadow-md"
              >
                Apply
              </button>
            </div>
          </section>

          {/* Notes Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold">📝 Order Notes (Optional)</h2>
            <textarea
              placeholder="Add any special instructions..."
              className="w-full mt-3 border rounded-lg px-3 py-2 h-24 resize-none"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </section>
        </div>

        {/* RIGHT SECTION (Summary) */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.product._id || item.product.id || item.product.sku}
                  className="flex items-center gap-4 mb-4"
                >
                  <img
                    src={
                      item.product.images?.split("~")[0]?.trim() ||
                      "/placeholder.png"
                    }
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty} × ₹{item.product.price}
                    </p>
                  </div>
                </div>
              ))}

              <hr className="my-4" />
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium mb-2">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-bold text-red-400">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-medium hover:shadow-md disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
