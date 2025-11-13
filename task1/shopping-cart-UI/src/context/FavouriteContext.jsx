// src/context/FavouriteContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    // Load from localStorage initially
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // Helper: Save to localStorage
  const persistToLocal = (updated) => {
    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

   // Add to favourites
   
  const addToFavourites = (product) => {
    const productId = product._id || product.sku || product.id;
    setFavourites((prev) => {
      if (prev.some((f) => (f._id || f.sku || f.id) === productId)) return prev;
      const updated = [...prev, product];
      localStorage.setItem("favourites", JSON.stringify(updated));
      toast.success("Added to favourites 💖");
      return updated;
    });

    syncToBackend();
  };

  /**
   * ❌ Remove from favourites
   */
  const removeFromFavourites = (productId) => {
    const updated = favourites.filter(
      (f) => (f._id || f.sku || f.id) !== productId
    );
    persistToLocal(updated);
    toast("Removed from favourites 💔");
    syncToBackend();
  };

  /**
   * 🔁 Toggle favourite
   */
  const toggleFavourite = (product) => {
    const productId = product._id || product.sku || product.id;
    if (favourites.some((f) => (f._id || f.sku || f.id) === productId)) {
      removeFromFavourites(productId);
    } else {
      addToFavourites(product);
    }
  };

   // Sync favourites to backend if logged in
  const syncToBackend = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      await api.put(`/users/${user._id}/favourites`, {
        favourites: favourites.map((f) => f._id),
      });
    } catch (err) {
      console.warn("⚠️ Failed to sync favourites:", err.message);
    }
  };

  //Load favourites from backend on login
  const loadFromBackend = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;

      setLoading(true);
      const res = await api.get(`/users/${user._id}/favourites`);
      const favs = res.data?.favourites || [];
      persistToLocal(favs);
    } catch (err) {
      console.error("❌ Failed to load favourites:", err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🧹 Clear favourites on logout
   */
  const clearFavourites = () => {
    setFavourites([]);
    localStorage.removeItem("favourites");
  };

  /**
   * 🚀 On mount — try to sync with backend if user logged in
   */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      loadFromBackend();
    }
  }, []);

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        loading,
        addToFavourites,
        removeFromFavourites,
        toggleFavourite,
        clearFavourites,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouriteContext);
