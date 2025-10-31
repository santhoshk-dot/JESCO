import "./App.css"
import Navbar from './components/Navbar'
import Home from './components/Home'
import Cart from "./components/Cart"
import Favourites from "./components/Favourites"
import Contact from "./components/Contact"
import MenuSidebar from './components/MenuSidebar'
import { useState } from 'react'
import Signup from './components/pages/Signup'
import Login from "./components/pages/Login"
import ForgotPassword from "./components/pages/ForgotPassword"
import ResetPassword from "./components/pages/ResetPassword"
import Products from './components/Products'
import { Routes, Route} from "react-router-dom"
import { CartProvider } from './context/CartContext'
import { FavouriteProvider } from './context/FavouriteContext'
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScroollToTop"
import About from "./components/About"
import Categories from "./components/Categories"
import ProductDetails from "./components/ProductDetails"
import Profile from "./components/pages/Profile"
import MyOrders from "./components/pages/MyOrders"
import QuickBuy from "./components/QuickBuy"
import Checkout from "./components/Checkout"
import AddAddress from "./components/AddAddress"
import AddressList from "./components/AddressList"
import BrandPage from "./components/Brands"



const App = () => {



  const [isCartOpen, setIsCartOpen] = useState(false)
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const [isLoginMode, setLoginMode] = useState(false)
  const togglelogin = () => {
    setLoginMode(!isLoginMode)
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

   
  return ( 
    <div className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white min-h-screen">

      <ScrollToTop />
      <CartProvider>
        <FavouriteProvider>
        <Navbar onToggleCart={toggleCart} onToggleMenu={toggleMenu} onToggleLogin={togglelogin} />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/favourites" element={<Favourites />}/>
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quickbuy" element={<QuickBuy />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/address" element={<AddressList />} />
            <Route path="/address/add" element={<AddAddress />} />
            <Route path="/brands" element={<BrandPage />} />
            <Route path="/myorders" element={<MyOrders />} />

          </Routes>
        <MenuSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </FavouriteProvider>
      </CartProvider>
      <Footer />
    </div>

  )
}

export default App