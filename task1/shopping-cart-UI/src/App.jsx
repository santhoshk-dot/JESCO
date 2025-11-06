import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Favourites from "./components/Favourites";
import Contact from "./components/Contact";
import MenuSidebar from "./components/MenuSidebar";
import { useState } from "react";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import Products from "./components/Products";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavouriteProvider } from "./context/FavouriteContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScroollToTop";
import About from "./components/About";
import Categories from "./components/Categories";
import ProductDetails from "./components/ProductDetails";
import Profile from "./components/pages/Profile";
import MyOrders from "./components/pages/MyOrders";
import QuickBuy from "./components/QuickBuy";
import Checkout from "./components/Checkout";
import AddAddress from "./components/AddAddress";
import AddressList from "./components/AddressList";
import BrandPage from "./components/Brands";

// 🧭 Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminOrders from "./components/admin/AdminOrders";
import AdminUsers from "./components/admin/AdminUsers";

// ✅ Protected Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginMode, setLoginMode] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLogin = () => setLoginMode(!isLoginMode);

  return (
    <div className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <ScrollToTop />

      <CartProvider>
        <FavouriteProvider>
          <Navbar
            onToggleCart={toggleCart}
            onToggleMenu={toggleMenu}
            onToggleLogin={toggleLogin}
          />

          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/quickbuy" element={<QuickBuy />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/address" element={<AddressList />} />
            <Route path="/address/add" element={<AddAddress />} />
            <Route path="/brands" element={<BrandPage />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} /> 
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>

          <MenuSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </FavouriteProvider>
      </CartProvider>

      <Footer />
    </div>
  );
};

// Wrap with AuthProvider globally
const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
