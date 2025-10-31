import React, { useState, useMemo } from "react";
import productsJSON from "../products.json";
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const QuickBuy = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [expandedCategories, setExpandedCategories] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, addToCart, updateQty, removeFromCart, cartSummary } = useCart();

  const { totalItems, totalAmount } = cartSummary;

  // ✅ Safely get products array
  const productsData = Array.isArray(productsJSON)
    ? productsJSON
    : productsJSON.data?.data || [];

  // Extract unique categories & brands
  const categories = [
    "All Categories",
    ...new Set(productsData.map((p) => p.category).filter(Boolean)),
  ];
  const brands = [
    "All Brands",
    ...new Set(productsData.map((p) => p.brand).filter(Boolean)),
  ];

  // ✅ Filter products based on search/category/brand
  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const text = `${p.name} ${p.category} ${p.brand}`.toLowerCase();
      const matchesSearch = !search || text.includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" || p.category === selectedCategory;
      const matchesBrand =
        selectedBrand === "All Brands" || p.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [search, selectedCategory, selectedBrand, productsData]);

  // ✅ Group products by category
  const productsByCategory = useMemo(() => {
    const grouped = {};
    filteredProducts.forEach((p) => {
      const cat = p.category || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
    return grouped;
  }, [filteredProducts]);

  const toggleCategory = (category) =>
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));

  const toNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  let serialNo = 1;

  // ✅ Handle checkout
  const handleCheckout = (e) => {
    if (!user?._id) {
      e.preventDefault();
      alert("⚠️ Please log in before placing an order.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      e.preventDefault();
      alert("🛒 Your cart is empty!");
      return;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-purple-600" size={26} />
          <h1 className="text-2xl font-bold text-gray-800">Quick Buy</h1>
          <span className="text-green-600 font-medium">
            {productsData.length} products loaded
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative bg-white">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-120 pl-10 pr-4 py-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-400"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-400"
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Product List */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-white text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">S.No</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Display Price</th>
                <th className="px-4 py-3 text-left">Selling Price</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(productsByCategory).map(([category, products]) => {
                const isExpanded = expandedCategories[category] ?? true;
                return (
                  <React.Fragment key={category}>
                    {/* Category Header */}
                    <tr
                      onClick={() => toggleCategory(category)}
                      className="bg-red-50 cursor-pointer border-4 border-gray-100"
                    >
                      <td
                        colSpan="8"
                        className="px-4 py-3 font-semibold text-red-400 text-base"
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-purple-800" />
                          ) : (
                            <ChevronDown size={16} className="text-purple-800" />
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Product Rows */}
                    {isExpanded &&
                      products.map((p) => {
                        const productId = p._id || p.sku || p.id;
                        const existing = items.find(
                          (i) =>
                            (i.product._id ||
                              i.product.sku ||
                              i.product.id) === productId
                        );
                        const qty = existing ? existing.qty : 0;
                        const displayPrice = toNumber(p.displayPrice || p.price);
                        const sellingPrice = toNumber(p.sellingPrice || p.price);
                        const total = qty * sellingPrice;

                        return (
                          <tr
                            key={productId}
                            className={`border-t border-gray-100 hover:bg-gray-50 ${
                              qty > 0 ? "bg-green-50" : ""
                            }`}
                          >
                            <td className="px-4 py-2">{serialNo++}</td>
                            <td className="px-4 py-2">{p.sku || "-"}</td>
                            <td className="px-4 py-2 flex items-center gap-2">
                              <img
                                src={
                                  p.images?.split("~")[0]?.trim() ||
                                  "/placeholder.png"
                                }
                                alt={p.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="truncate max-w-[200px]">
                                {p.name}
                              </span>
                            </td>
                            <td className="px-4 py-2">{p.brand || "-"}</td>
                            <td className="px-4 py-2 text-gray-500">
                              ₹{displayPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-green-600 font-semibold">
                              ₹{sellingPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() =>
                                    qty > 0
                                      ? updateQty(productId, qty - 1)
                                      : null
                                  }
                                  className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                  <Minus size={14} />
                                </button>
                                <input
                                  type="text"
                                  value={qty}
                                  readOnly
                                  className="w-10 text-center border rounded-md"
                                />
                                <button
                                  onClick={() => addToCart(p)}
                                  className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                              {qty > 0 ? `₹${total.toFixed(2)}` : "-"}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ✅ Right: Cart Summary */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-8 self-start">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {items.length === 0 && (
            <p className="text-gray-500 text-sm mb-4">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={item.product._id || item.product.sku}
              className="flex items-center gap-4 mb-4 border-b pb-3"
            >
              <img
                src={
                  item.product.images?.split("~")[0]?.trim() ||
                  "/placeholder.png"
                }
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg border"
              />
              <div>
                <h3 className="font-medium text-gray-800 truncate max-w-[140px]">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.qty} × ₹{item.product.price}
                </p>
              </div>
            </div>
          ))}

          <p className="flex justify-between mb-2 text-sm">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </p>
          <p className="flex justify-between mb-2 text-sm">
            <span>Subtotal:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </p>

          <hr className="my-3" />
          <p className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
          </p>

          <Link
            to="/checkout"
            onClick={handleCheckout}
            className={`mt-4 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
              totalItems === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white transform hover:scale-105 transition-all duration-200"
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickBuy;
