import { useCart } from "../context/CartContext";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

// same getPrice helper
function getPrice(product) {
  if (!product) return 0;
  const p = product.price ?? product.amount ?? product.value;
  if (p == null) return 0;
  if (typeof p === "number") return p;
  if (typeof p === "string") {
    const cleaned = p.replace(/[^\d.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export default function Cart() {
  const { items, removeFromCart, clearCart, updateQty } = useCart();

  const total = items.reduce(
    (sum, i) => sum + getPrice(i.product) * (i.qty ?? 1),
    0
  );

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h2>
        <Link
          to="/products"
          className="bg-red-400 text-white px-6 py-2 rounded hover:bg-red-500"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>

      <div className="space-y-4">
        {items.map(({ product, qty = 1 }) => {
          const productId = product._id || product.sku || product.id;
          const productImage = Array.isArray(product.images)
            ? product.images[0]
            : product.images;
          const priceNum = getPrice(product);

          return (
            <div
              key={productId}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={productImage || "/placeholder.png"}
                  alt={product.name || product.title}
                  className="w-20 h-30 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">
                    {product.name || product.title}
                  </h3>
                  <p className="text-gray-600">
                    {(product.currency ?? "") + priceNum.toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() =>
                        qty > 1
                          ? updateQty(productId, qty - 1)
                          : 1 
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3">{qty}</span>
                    <button
                      onClick={() => updateQty(productId, qty + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="font-semibold">
                  {(product.currency ?? "") + (priceNum * qty).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center">

        <button></button>
       
        <div className="text-xl font-bold">Total: {total.toFixed(2)}</div>
      </div>

      <div className="mt-8 text-right justify-between flex">

         <button
          onClick={clearCart}
          className="bg-red-400  text-white px-3 py-2 rounded-lg
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                 space-x-2 cursor-pointer font-medium text-xs"
        >
          Clear Cart
        </button>
        <Link to="/checkout" className="bg-green-600 text-white px-6 py-3 rounded-lg  hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                 space-x-2 cursor-pointer font-medium text-xs">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
