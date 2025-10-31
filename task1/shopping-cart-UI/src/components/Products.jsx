import { useState } from "react";
import ProductCard from "../components/ProductCard";
import productsJSON from "../products.json";
import { useSearch } from "../context/SearchContext";
import { Filter, X } from "lucide-react";

export default function Products() {
  const { searchTerm } = useSearch();

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Extract products from JSON
  const productsData = productsJSON.data.data;

  const categories = [...new Set(productsData.map((p) => p.category).filter(Boolean))];
  const brands = ["All", ...new Set(productsData.map((p) => p.brand || "Unknown"))];

  const filteredProducts = productsData
    .filter((p) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
    )
    .filter((p) => (category ? p.category === category : true))
    .filter((p) => (brand !== "All" ? p.brand === brand : true))
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      if (sort === "alpha") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 relative">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilters(true)}
        className="md:hidden flex items-center gap-2 bg-red-400 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-500 transition-all mb-4"
      >
        <Filter size={18} />
        Filters
      </button>

      {/* Sidebar Filters (Drawer for mobile) */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-fit w-72 md:w-64 bg-white dark:bg-gray-900 shadow-lg md:shadow-none rounded-none md:rounded-xl p-6 space-y-6 z-50 transform transition-transform duration-300 ease-in-out 
        ${showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Close Button (Mobile only) */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={() => setShowFilters(false)} className="text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Category */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-2 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Brand</h3>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border rounded px-2 py-2 dark:bg-gray-800 dark:text-white"
          >
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Price Range</h3>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-red-400 mt-2"
          />
        </div>

        {/* Sort */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Sort</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded px-2 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Default</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setCategory("");
            setBrand("All");
            setPriceRange([0, 10000]);
            setSort("");
          }}
          className="w-full mt-4 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded-lg transition-all duration-200"
        >
          Reset Filters
        </button>
      </aside>

      {/* Overlay (Mobile) */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Product Grid */}
      <main className="flex-1">
        {searchTerm && (
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Showing results for:{" "}
            <span className="font-semibold">{searchTerm}</span>
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No products found
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
