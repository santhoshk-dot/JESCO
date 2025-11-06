import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaChevronDown,
} from "react-icons/fa";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import "../App.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "../context/SearchContext";

const Navbar = ({ onToggleCart, onToggleMenu }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);

  // 🔍 Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate("/products");
  };

  const clearSearch = () => setSearchTerm("");

  // 🧭 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl flex justify-between items-center py-3">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-black dark:text-white font-bold text-xl tracking-wide"
        >
          JESCO
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex text-sm gap-10 px-20 items-center font-semibold dark:text-gray-200">
          {[
            ["Products", "/products"],
            ["Categories", "/categories"],
            ["Brands", "/brands"],
            ["About", "/about"],
            ["Contact", "/contact"],
            ["Quick Buy", "/quickbuy"],
          ].map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? "text-red-400 font-semibold" : ""
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex text-sm gap-5 items-center relative dark:text-gray-200">
          {/* 🔎 Search box */}
          <div
            className={`relative flex items-center border rounded-full bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out ${
              isExpanded ? "w-56 shadow-md" : "w-32"
            } px-3 py-1`}
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

          {/* ❤️ Wishlist */}
          <Link to="/favourites" className="hover:text-red-400">
            <FaHeart />
          </Link>

          {/* 🛒 Cart */}
          <Link
            to="/cart"
            className="relative hover:text-red-400"
            onClick={onToggleCart}
          >
            <FaShoppingCart />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-400 text-white px-1 rounded-full text-[10px]">
                {items.length}
              </span>
            )}
          </Link>

          {/* 👤 User Dropdown */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-red-400"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
                <FaChevronDown className="w-3 h-3" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    to="/myorders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📦 My Orders
                  </Link>

                  {/* 🛠️ Admin Dashboard Link */}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🧭 Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
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
              className="px-3 py-1 inline-flex bg-red-400 cursor-pointer p-2 font-semibold text-white text-xs rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 items-center space-x-2"
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
