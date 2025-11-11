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

  // Payment
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);

  const UPI_ID = "jesco@upi";
  const BUSINESS_NAME = "Jesco Store";

  // 🧠 Load addresses + restore selected
  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) setSelectedAddress(JSON.parse(saved));
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

  // 💰 Totals
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price || 0) * i.qty,
    0
  );
  const total = subtotal - discount;

  // 📦 Coupon
  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "save10") {
      const newDiscount = subtotal * 0.1;
      setDiscount(newDiscount);
      alert("✅ 10% discount applied!");
      setCoupon(""); // reset input
    } else {
      setDiscount(0);
      alert("❌ Invalid coupon code");
    }
  };

  // 📤 Upload screenshot
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image!");
      return;
    }
    setPaymentProof(file);
  };

  // 🧾 Place Order
  const handlePlaceOrder = async () => {
    if (loading) return; // prevent double clicks
    if (!token || !user?._id)
      return alert("⚠️ Please log in before placing an order!");
    if (!selectedAddress) return alert("Please select a delivery address!");
    if (items.length === 0) return alert("Your cart is empty!");
    if (!paymentProof) return alert("⚠️ Please upload your payment screenshot!");

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);

    const orderData = {
      deliveryAddress: {
        label: selectedAddress?.label || "Home",
        address: selectedAddress?.address || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        zip: selectedAddress?.zip?.toString() || "000000",
        country: selectedAddress?.country || "India",
      },
      items: items.map((i) => ({
        productId: String(i.product._id || i.product.id || i.product.sku || ""),
        name: i.product.name || "Unnamed Product",
        price: Number(i.product.price) || 0,
        qty: Number(i.qty) || 1,
      })),
      orderNotes: orderNotes?.trim() || "",
      subtotal: Number(subtotal.toFixed(2)) || 0,
      discount: Number(discount.toFixed(2)) || 0,
      total: Number(total.toFixed(2)) || 0,
      deliveryDate: new Date(deliveryDate).toISOString(),
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("paymentProof", paymentProof);
      formData.append("order", JSON.stringify(orderData));

      const res = await api.post("/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201 || res.status === 200) {
        alert("🎉 Order placed successfully!");
        await clearCart();
        localStorage.removeItem("selectedAddress");
        navigate("/myorders");
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (err) {
      const errors =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        err.message;
      console.error("❌ Order creation failed:", errors);

      if (Array.isArray(errors)) {
        alert(
          "❌ " +
            errors
              .map(
                (e) =>
                  `${e.property}: ${Object.values(e.constraints || {}).join(", ")}`
              )
              .join("\n")
        );
      } else if (typeof errors === "string") {
        alert("❌ " + errors);
      } else {
        alert("❌ Something went wrong. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Generate QR dynamically
  const qrData = `upi://pay?pa=${encodeURIComponent(
    UPI_ID
  )}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${total.toFixed(2)}&cu=INR`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 gap-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Address + Notes */}
        <div className="flex-1 space-y-8">
          {/* 🏠 Address Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">📍 Delivery Address</h2>
              <Link
                to="/address/add"
                className="bg-red-400 text-white px-3 py-1 rounded-lg hover:shadow-md"
              >
                + Add New
              </Link>
            </div>

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

            {showDropdown && (
              <div className="mt-3 border border-gray-200 rounded-lg shadow-inner bg-white max-h-60 overflow-y-auto">
                {addresses.length > 0 ? (
                  addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedAddress(addr);
                        localStorage.setItem("selectedAddress", JSON.stringify(addr));
                        setShowDropdown(false);
                      }}
                      className={`p-3 border-b cursor-pointer transition-all duration-200 ${
                        selectedAddress?._id === addr._id
                          ? "bg-red-50 border-l-4 border-red-400"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-semibold">{addr.label}</p>
                      <p className="text-sm text-gray-600 leading-snug">
                        {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                        {addr.country}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-500 text-sm">
                    No saved addresses yet. Please add one.
                  </p>
                )}
              </div>
            )}
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

          {/* Notes */}
          <section className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">📝 Order Notes (Optional)</h2>
            <textarea
              placeholder="Add any special instructions..."
              className="w-full mt-3 border rounded-lg px-3 py-2 h-24 resize-none"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </section>
        </div>

        {/* RIGHT: Summary + Payment */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 mb-4">
                  <img
                    src={item.product.images?.split("~")[0]?.trim() || "/placeholder.png"}
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

              {/* 💳 Payment Section */}
              <div className="mt-6 border-t pt-4">
                {!showPayment ? (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                  >
                    Pay Now
                  </button>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-gray-600 text-sm">
                      Scan the QR to pay ₹{total.toFixed(2)} to <b>{UPI_ID}</b>
                    </p>
                    <img
                      src={qrImage}
                      alt="UPI Payment QR"
                      className="mx-auto w-48 h-48 border rounded-lg"
                    />
                    <p className="text-sm text-gray-500">{BUSINESS_NAME}</p>

                    <div className="mt-4">
                      <label className="block font-medium mb-2 text-left">
                        Upload Payment Screenshot:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="border p-2 rounded-md w-full"
                      />
                      {paymentProof && (
                        <>
                          <p className="text-green-600 text-sm mt-2">
                            ✅ {paymentProof.name} uploaded successfully
                          </p>
                          <img
                            src={URL.createObjectURL(paymentProof)}
                            alt="Proof Preview"
                            className="w-32 h-32 object-cover rounded-lg border mt-2 mx-auto"
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {showPayment && paymentProof && (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-medium hover:shadow-md disabled:opacity-60"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
