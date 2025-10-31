import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Heart, ShoppingCart } from "lucide-react";
import { useFavourites } from "../context/FavouriteContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { favourites, toggleFavourite } = useFavourites();
  const navigate = useNavigate();

  const productId = product._id || product.sku || product.id;
  const isFav = favourites.some((f) => (f._id || f.sku || f.id) === productId);

  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);

  const description =
    product.description && product.description.length > 70
      ? product.description.substring(0, 60) + "..."
      : product.description;

  const Rating = (rating) => {
    return Array.from({ length: Math.floor(rating) }, (_, index) => (
      <FaStar
        key={index}
        className="w-4 h-4 fill-yellow-400 text-yellow-400"
      />
    ));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  const handleFavourite = (e) => {
    e.stopPropagation();
    toggleFavourite(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  // Determine product image
  const productImage =
    product.medias && product.medias.length > 0
      ? product.medias[0].url
      : product.image && product.image !== "🎆"
      ? product.image
      : "https://via.placeholder.com/150";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleCardClick}
      className="group relative rounded-2xl bg-white shadow-md hover:shadow-2xl hover:scale-103 
      transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image */}

      <img
        src={product.image || "https://placehold.co/150x150?text=No+Image"}
        alt={product.name || "Product"}
        className="rounded-t-2xl w-full h-60 object-cover group-hover:scale-110 transition-all duration-500"
      />

      {/* Floating Action Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {hover && (
          <motion.button
            whileTap={{ scale: 0.8 }}
            animate={added ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.5 }}
            onClick={handleAddToCart}
            className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100"
          >
            <ShoppingCart size={18} />
          </motion.button>
        )}

        <button
          onClick={handleFavourite}
          className={`p-2 rounded-full shadow ${
            isFav ? "bg-red-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3">
        <p className="text-gray-800 font-semibold text-sm truncate">
          {product.name}
        </p>
        {description && (
          <p className="text-gray-500 text-xs truncate">{description}</p>
        )}

        <p className="flex items-center text-xs mb-2">
          {Rating(product.defaultRating)}{" "}
          <span className="ml-1 text-gray-500">
            {product.defaultRating} ({product.salesCount || 0} Reviews)
          </span>
        </p>

        <div className="text-gray-900 text-sm font-bold flex items-center justify-between">
          <span>₹{product.price}</span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={added ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            onClick={handleAddToCart}
            className="group/btn bg-red-400  text-white px-3 py-2 rounded-lg
              hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex
              items-center space-x-2 cursor-pointer font-medium text-xs"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
