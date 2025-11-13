import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // 🧩 Load from localStorage initially
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // ✅ Helper to get consistent product ID
  const getProductId = (product) => product._id || product.sku || product.id;

  // ✅ Save cart to localStorage
  const persistCart = (updated) => {
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ Add product (or increase quantity)
  const addToCart = (product) => {
    const productId = getProductId(product);

    setItems((prev) => {
      const existing = prev.find((i) => getProductId(i.product) === productId);
      let updated;

      if (existing) {
        updated = prev.map((i) =>
          getProductId(i.product) === productId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
        toast.success("Quantity increased 🛒");
      } else {
        updated = [...prev, { product, qty: 1 }];
        toast.success("Added to cart 🛍️");
      }

      localStorage.setItem("cart", JSON.stringify(updated));
      syncCartToBackend(updated);
      return updated;
    });
  };

  // ✅ Remove a product entirely
  const removeFromCart = (productId) => {
    const updated = items.filter((i) => getProductId(i.product) !== productId);
    persistCart(updated);
    toast("Removed from cart ❌");
    syncCartToBackend(updated);
  };

  // ✅ Clear entire cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
    syncCartToBackend([]);
  };

  // ✅ Update quantity (auto remove if 0)
  const updateQty = (productId, newQty, product) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) => {
      const exists = prev.find((i) => getProductId(i.product) === productId);
      let updated;

      if (exists) {
        updated = prev.map((i) =>
          getProductId(i.product) === productId ? { ...i, qty: newQty } : i
        );
      } else {
        updated = [...prev, { product, qty: newQty }];
      }

      persistCart(updated);
      syncCartToBackend(updated);
      return updated;
    });
  };

  // Derived totals
  const cartSummary = useMemo(() => {
    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = items.reduce(
      (sum, i) => sum + (i.product.price || 0) * i.qty,
      0
    );
    return { totalItems, totalAmount };
  }, [items]);

  //Sync with backend if logged in
  const syncCartToBackend = async (updatedCart = items) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;
      await api.put(`/users/${user._id}/cart`, {
        cart: updatedCart.map((i) => ({
          product: getProductId(i.product),
          qty: i.qty,
        })),
      });
    } catch (err) {
      console.warn("⚠️ Failed to sync cart:", err.message);
    }
  };

  // Load cart from backend if logged in
  const loadCartFromBackend = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      setLoading(true);
      const res = await api.get(`/users/${user._id}/cart`);
      const userCart = res.data?.cart || [];

      persistCart(userCart);
    } catch (err) {
      console.error("❌ Failed to load cart:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sync on login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) loadCartFromBackend();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        cartSummary,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
