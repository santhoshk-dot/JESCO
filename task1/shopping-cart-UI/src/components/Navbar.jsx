import { FaHeart, FaSearch, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import "../App.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { User, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext"; // Import global search context

const Navbar = ({ onToggleCart, onToggleMenu }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch(); // Shared search state
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate("/products"); //Redirect to products
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl flex justify-between items-center py-3">
        {/* Logo */}
        <NavLink to="/" className="text-black dark:text-white font-bold text-xl">
          JESCO
        </NavLink>

        {/* Nav Links */}
        <div className="hidden lg:flex text-sm gap-10 px-20 cursor-default items-center font-semibold dark:text-gray-200">
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "text-red-400 font-medium" : "")}
          >
            Products
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? "text-red-400 font-medium" : "")}
          >
            Categories
          </NavLink>
          <NavLink
            to="/brands"
            className={({ isActive }) => (isActive ? "text-red-400 font-medium" : "")}
          >
            Brands
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "text-red-400 font-medium" : "")}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "text-red-400 font-medium" : "")}
          >
            Contact
          </NavLink>
          <NavLink
            to="/quickbuy"
            className={({ isActive }) => (isActive ? "text-red-400  font-bold" : "")}
          >
            Quick Buy
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex text-sm gap-5 items-center relative dark:text-gray-200">
          {/*  Animated Search */}
          <div
            className={`relative flex items-center border rounded-full bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out 
            ${isExpanded ? "w-56 shadow-md" : "w-32"} px-3 py-1`}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
              className="bg-transparent focus:outline-none w-full pr-6 dark:text-gray-100"
            />
            {searchTerm && (
              <AiOutlineClose
                onClick={clearSearch}
                className="absolute right-8 cursor-pointer text-gray-400 hover:text-red-400"
              />
            )}
            <FaSearch className="ml-auto text-gray-500 dark:text-gray-300" />
          </div>

          {/*  Wishlist */}
          <Link to="/favourites" className="hover:text-red-400">
            <FaHeart />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-red-400" onClick={onToggleCart}>
            <FaShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-400 text-white px-1 rounded-full text-[10px]">
                {items.length}
              </span>
            )}
          </Link>

          {/* 🌙 Dark Mode Toggle */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 hover:scale-105 transition-transform"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button> */}

          {/* 👤 User Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-red-400"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
                <FaChevronDown className="w-3 h-3" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 z-50">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    👤 Profile
                  </Link>
                  <Link to="/myorders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    📦 My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1  inline-flex bg-red-400 cursor-pointer p-2 font-semibold
             text-white text-xs  outline-none   rounded-lg
                hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                items-center space-x-2"
            >
              Login
            </Link>
          )}

          {/* 📱 Mobile Menu */}
          <div className="lg:hidden">
            <button onClick={onToggleMenu} className="text-xl">
              <AiOutlineMenuUnfold />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
