import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Helper to get consistent product ID
  const getProductId = (product) => product._id || product.sku || product.id;

  // Add product to cart (or increase quantity)
  const addToCart = (product) => {
    const productId = getProductId(product);

    setItems((prev) => {
      const existing = prev.find(
        (i) => getProductId(i.product) === productId
      );

      if (existing) {
        return prev.map((i) =>
          getProductId(i.product) === productId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      } else {
        return [...prev, { product, qty: 1 }];
      }
    });
  };

  // Remove product from cart completely
  const removeFromCart = (productId) => {
    setItems((prev) =>
      prev.filter((i) => getProductId(i.product) !== productId)
    );
  };

  //  Clear all items
  const clearCart = () => setItems([]);

  //  Update quantity or remove if zero
  const updateQty = (productId, newQty, product) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) => {
      const exists = prev.find((i) => getProductId(i.product) === productId);

      if (exists) {
        return prev.map((i) =>
          getProductId(i.product) === productId
            ? { ...i, qty: newQty }
            : i
        );
      } else {
        return [...prev, { product, qty: newQty }];
      }
    });
  };

  // Compute derived values (reactive totals)
  const cartSummary = useMemo(() => {
    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = items.reduce(
      (sum, i) => sum + i.product.price * i.qty,
      0
    );
    return { totalItems, totalAmount };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        cartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

//  Custom hook to use cart easily
export const useCart = () => useContext(CartContext);
