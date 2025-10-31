// context/FavouriteContext.jsx
import { createContext, useContext, useState } from "react";

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  // Add product to favourites
  const addToFavourites = (product) => {
    const productId = product._id || product.sku || product.id;
    setFavourites((prev) => {
      if (prev.some((f) => (f._id || f.sku || f.id) === productId)) {
        return prev; // already exists
      }
      return [...prev, product];
    });
  };

  // Remove product from favourites
  const removeFromFavourites = (productId) => {
    setFavourites((prev) =>
      prev.filter((f) => (f._id || f.sku || f.id) !== productId)
    );
  };

  // Toggle favourite
  const toggleFavourite = (product) => {
    const productId = product._id || product.sku || product.id;
    if (favourites.some((f) => (f._id || f.sku || f.id) === productId)) {
      removeFromFavourites(productId);
    } else {
      addToFavourites(product);
    }
  };

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        toggleFavourite,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouriteContext);
