import { useFavourites } from "../context/FavouriteContext";
import { useCart } from "../context/CartContext"; // ✅ optional: add cart integration
import { HeartOff, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Favourites() {
  const { favourites, removeFromFavourites } = useFavourites();
  const { addToCart } = useCart?.() || {}; // optional cart hook fallback

  // 🩶 Empty State
  if (!favourites || favourites.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <img
          src="/empty-fav.svg"
          alt="Empty favourites"
          className="mx-auto w-60 opacity-80 mb-6"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          No Favourites Yet ❤️
        </h2>
        <p className="text-gray-500 mb-6">
          Save products you love to easily find them later.
        </p>
        <Link
          to="/products"
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // 🩵 Favourites List
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Your Favourites ❤️
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favourites.map((product) => {
          const productId = product._id || product.sku || product.id;
          const productImage =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : product.image || "/placeholder.png";

          return (
            <div
              key={productId}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={productImage}
                  alt={product.name || product.title}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove Favourite Button */}
                <button
                  onClick={() => {
                    removeFromFavourites(productId);
                    toast("Removed from favourites 💔");
                  }}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                >
                  <HeartOff size={18} />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate text-gray-800 dark:text-gray-100">
                  {product.name || product.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-3">
                  {product.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  {product.price && (
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      ₹{product.price}
                    </p>
                  )}

                  {/* Add to Cart */}
                  {addToCart && (
                    <button
                      onClick={() => {
                        addToCart(product);
                        toast.success("Added to cart 🛒");
                      }}
                      className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
