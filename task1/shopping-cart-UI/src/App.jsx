import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScroollToTop";
import MenuSidebar from "./components/MenuSidebar";

// Public pages
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Favourites from "./components/Favourites";
import Contact from "./components/Contact";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import About from "./components/About";
import Categories from "./components/Categories";
import ProductDetails from "./components/ProductDetails";
import Profile from "./components/pages/Profile";
import MyOrders from "./components/pages/MyOrders";
import QuickBuy from "./components/QuickBuy";
import Checkout from "./components/Checkout";
import AddAddress from "./components/AddAddress";
import BrandPage from "./components/Brands";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminUsers from "./components/admin/AdminUsers";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <ScrollToTop />

      <CartProvider>
        <FavouriteProvider>
          <Navbar
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onToggleMenu={() => setMenuOpen(!menuOpen)}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<BrandPage />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="quickbuy" element={<QuickBuy />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="address/add" element={<AddAddress />} />
            <Route path="myorders" element={<MyOrders />} />
            <Route path="profile" element={<Profile />} />

            {/* Admin Routes — RELATIVE paths only */}
            <Route
              path="admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>

          <MenuSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <Footer />
        </FavouriteProvider>
      </CartProvider>
    </div>
  );
};


export default App;
