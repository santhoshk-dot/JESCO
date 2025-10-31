import React, { useState } from "react";
import productsJSON from "../products.json"; // your JSON
import ProductCard from "./ProductCard";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract products from JSON
  const productsData = productsJSON.data.data;

  // Extract unique categories
  const categories = ["All", ...new Set(productsData.map((p) => p.category).filter(Boolean))];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? productsData
      : productsData.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-20 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Shop by Category</h1>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 
              ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <main className="flex-1">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No products found in this category.
          </p>
        )}
      </main>
    </div>
  );
};

export default Categories;
