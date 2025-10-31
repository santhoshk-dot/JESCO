import React, { useState, useMemo } from "react";
import productsJSON from "../products.json";
import ProductCard from "./ProductCard";
import { FaArrowLeft, FaBackward, FaBalanceScaleRight } from "react-icons/fa";

const Brands = () => {
  // Handle nested structure
  const productsData = productsJSON?.data?.data || productsJSON;

  if (!Array.isArray(productsData)) {
    console.error("Invalid product data:", productsData);
    return <p className="text-center text-red-500 mt-10">Error loading products.</p>;
  }

  // Group products by brand
  const brandGroups = useMemo(() => {
    return productsData.reduce((acc, product) => {
      const brand = product.brand || "Unknown";
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(product);
      return acc;
    }, {});
  }, [productsData]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortOption, setSortOption] = useState("name"); // 'name' | 'count'

  // Sort brands
  const sortedBrands = useMemo(() => {
    const entries = Object.entries(brandGroups);
    if (sortOption === "name") {
      return entries.sort(([a], [b]) => a.localeCompare(b));
    } else if (sortOption === "count") {
      return entries.sort(([, aProducts], [, bProducts]) => bProducts.length - aProducts.length);
    }
    return entries;
  }, [brandGroups, sortOption]);

  //  Show brand cards when none selected
  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-12 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left">
            Explore Our Brands
          </h1>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="name">Name (A–Z)</option>
              <option value="count">Product Count (High–Low)</option>
            </select>
          </div>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedBrands.map(([brandName, products]) => (
            <div
              key={brandName}
              onClick={() => setSelectedBrand(brandName)}
              className="cursor-pointer bg-red-100 dark:bg-gray-800 rounded-xl shadow-md 
              hover:shadow-lg transition-all duration-200 hover:scale-105 p-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full 
              flex items-center justify-center text-white font-bold text-xl mb-4">
                {brandName[0]?.toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                {brandName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {products.length} Products
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //  Show brand products when selected
  const selectedProducts = brandGroups[selectedBrand] || [];

  return (
    <div className="min-h-screen  dark:bg-gray-900 px-8 py-12 transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {selectedBrand} Products
        </h1>
        <button
          onClick={() => setSelectedBrand(null)}
          className=" flex  gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 
              hover:shadow-lg transform hover:scale-105 transition-all duration-200 
              items-center space-x-2 cursor-pointer font-medium text-xs dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <FaArrowLeft/> Back to Brands
        </button>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {selectedProducts.map((product) => (
            <ProductCard key={product.sku || product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No products found for {selectedBrand}.
        </p>
      )}
    </div>
  );
};

export default Brands;
