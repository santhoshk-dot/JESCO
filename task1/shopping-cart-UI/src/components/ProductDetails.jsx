import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavourites } from "../context/FavouriteContext";
import productsJSON from "../products.json";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { FaCreditCard, FaHome, FaTruck, FaRedo } from "react-icons/fa";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { favourites, toggleFavourite } = useFavourites();
  const [added, setAdded] = useState(false);

  // Extract products from JSON
  const productsData = productsJSON.data.data;

  // Find product by _id or id
  const product = productsData.find((p) => p._id === id || p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Product not found 😕</h2>
        <Link to="/products" className="text-red-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  // Check if product is in favourites
  const productId = product._id || product.id;
  const isFav = favourites.some((f) => (f._id || f.id) === productId);

  // Delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Recommended products
  const recommended = productsData
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  // Price + Discount Logic
  const oldPrice = product.originalPrice || Math.round(product.price * 1.25);
  const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);

  // Determine product images
  const images =
    product.medias && product.medias.length > 0
      ? product.medias.map((m) => m.url)
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Product Details Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {images.length > 1 ? (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  className="rounded-2xl shadow-lg object-cover w-full h-56 md:h-72"
                />
              ))}
            </div>
          ) : (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-fit rounded-2xl shadow-lg object-cover"
            />
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm">{product.category}</p>

          {/* Price Display with Discount */}
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-red-500">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-gray-400 line-through text-lg">
              ₹{oldPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-green-600 font-semibold text-sm bg-green-100 px-2 py-1 rounded-md">
              {discount}% OFF
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Stock Info */}
          <div>
            {product.inStock ? (
              <span className="text-green-600 font-semibold">✅ In Stock</span>
            ) : (
              <span className="text-red-500 font-semibold">❌ Out of Stock</span>
            )}
          </div>

          {/* Delivery Info */}
          <div className="border-t pt-4 text-sm space-y-2 text-gray-700">
            <p className="flex gap-2 items-center">
              <FaTruck /> Estimated Delivery: <strong>{formattedDelivery}</strong>
            </p>
            <p className="flex gap-2 items-center">
              <FaRedo /> Return Policy: 7-day easy returns
            </p>
            <p className="flex gap-2 items-center">
              <FaCreditCard /> Refunds processed within 3–5 business days
            </p>
            <p className="flex gap-2 items-center">
              <FaHome /> Free shipping on orders above ₹999
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={added ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 
              hover:shadow-lg transform hover:scale-105  
               space-x-2 text-xs ${
                 product.inStock
                   ? "bg-red-400"
                   : "bg-gray-400 cursor-not-allowed"
               }`}
            >
              <ShoppingCart size={18} />
              {added ? "Added!" : "Add to Cart"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavourite(product)}
              className={`p-3 rounded-full shadow hover:shadow-lg transform hover:scale-105  ${
                isFav
                  ? "bg-red-400 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <Heart size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
