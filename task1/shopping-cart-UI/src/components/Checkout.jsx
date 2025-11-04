import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaTag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load selected address on mount
  useEffect(() => {
    const addr = localStorage.getItem("selectedAddress");
    if (addr) setSelectedAddress(JSON.parse(addr));
  }, []);

  // ✅ Cart calculations
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price || 0) * i.qty,
    0
  );
  const total = subtotal - discount;

  // ✅ Coupon handler
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

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);
 

  //Place order
  const handlePlaceOrder = async () => {
    // Check login
    if (!token || !user?._id) {
      alert("⚠️ Please log in before placing an order!");
      navigate("/login");
      return;
    }

    // Check address
    if (!selectedAddress) {
      alert("Please select a delivery address!");
      return;
    }

    // Check cart
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      userId: user._id,
      deliveryAddress: {
        label: selectedAddress.label || "Home",
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        country: selectedAddress.country,
      },
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
      // paymentMethod: "Offline", // 👈 optional
      deliveryDate: deliveryDate.toISOString(),
    };

    try {
      setLoading(true);

      const res = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("❌ Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
    // console.log("🧾 orderData:", JSON.stringify(orderData, null, 2));
    console.log(API_BASE_URL)


  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 gap-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-8">
          {/* Address Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                📍 Delivery Address
              </h2>
              <Link
                to="/address/add"
                className="bg-red-400 text-white px-3 py-1 rounded-lg hover:shadow-md"
              >
                + Add New
              </Link>
            </div>

            {selectedAddress ? (
              <div className="mt-4 p-3 border rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-800">{selectedAddress.label}</p>
                <p className="text-gray-600">
                  {selectedAddress.address}, {selectedAddress.city},{" "}
                  {selectedAddress.state}, {selectedAddress.zip},{" "}
                  {selectedAddress.country}
                </p>
                <Link
                  to="/address"
                  className="mt-2 inline-block text-white bg-red-400 px-3 py-1 rounded-lg hover:shadow-md"
                >
                  Change Address
                </Link>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-gray-500">
                  No addresses found. Please add a delivery address.
                </p>
                <Link to="/address">
                  <button className="mt-4 bg-black text-white px-5 py-2 rounded-lg hover:shadow-md">
                    Add Address
                  </button>
                </Link>
              </div>
            )}
          </section>

          {/* Coupon Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaTag /> Apply Coupon
            </h2>
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg mt-3 text-sm">
              💡 Payment will be collected offline after order confirmation.
            </div>

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

        {/* RIGHT SECTION */}
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
