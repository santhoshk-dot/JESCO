import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  // Reset form helper
  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  /**
   * 🧠 Fetch Products with filters, pagination, and sorting
   */
  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
        search: search || undefined,
        category: category || undefined,
        brand: brand || undefined,
        sort,
      };

      const res = await api.get("/products", { params });
      const { data, totalPages } = res.data;

      setProducts(data || []);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category, brand, sort]);

  /**
   * ✏️ Handle input changes
   */
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /**
   * 💾 Handle form submission (Create or Update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success("✅ Product updated successfully!");
      } else {
        await api.post(`/products`, payload);
        toast.success("✅ Product created successfully!");
      }

      resetForm();
      fetchProducts(page);
    } catch (err) {
      console.error("❌ Error saving product:", err);
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  /**
   * 🧩 Edit product
   */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  /**
   * ❌ Delete product
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("🗑️ Product deleted!");
      fetchProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
      console.error("Error deleting product:", err);
    }
  };

  /**
   * 🔄 Reset filters
   */
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("newest");
    setPage(1);
  };

  /* -------------------- JSX -------------------- */
  return (
    <div className="p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          🧩 Product Inventory
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
        >
          <option value="">All Categories</option>
          <option value="dhamaka">Dhamaka</option>
          <option value="fancy">Fancy</option>
          <option value="giftbox">Gift Box</option>
        </select>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
        >
          <option value="">All Brands</option>
          <option value="LIMA">LIMA</option>
          <option value="SHANMUGAPRIYA">SHANMUGAPRIYA</option>
          <option value="MOTHERS">MOTHERS</option>
          <option value="VAGEESH">VAGEESH</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
        >
          <option value="newest">Newest</option>
          <option value="priceLowHigh">Price: Low → High</option>
          <option value="priceHighLow">Price: High → Low</option>
          <option value="stockLowHigh">Stock: Low → High</option>
          <option value="stockHighLow">Stock: High → Low</option>
        </select>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <Filter size={16} /> Reset
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-right">Price (₹)</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={p.image || "/placeholder.jpg"}
                        alt={p.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">{p.brand}</td>
                    <td className="px-4 py-3 text-right">{p.price}</td>
                    <td
                      className={`px-4 py-3 text-center ${
                        p.stock > 0
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-medium"
                      }`}
                    >
                      {p.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.status === "active" ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
