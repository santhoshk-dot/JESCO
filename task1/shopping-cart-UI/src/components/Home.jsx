import React from "react";
import { FaShoppingBag } from "react-icons/fa";
import Services from "./Services";
import productsJSON from "../products.json";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import HeroSlider from "./HeroSlider"; 

const Home = () => {
  // Extract products from JSON
  const Products = productsJSON.data.data;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Sliding Banner */}
      <div className="mb-12">
        <HeroSlider />
      </div>

      {/* Services Section */}
      <div className="my-10">
        <Services />
      </div>

      {/* New Arrivals */}
      <h1 className="text-center font-extrabold text-red-400 text-2xl mb-6 dark:text-red-300">
        New Arrivals
      </h1>

      <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8 mb-16">
        <Link to="/products">
          <button
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 
              hover:shadow-lg transform hover:scale-105 transition-all duration-200 
              items-center space-x-2 cursor-pointer font-medium text-xs dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            View All Products →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
