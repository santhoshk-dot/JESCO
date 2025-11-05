import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash2, Loader2, Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${VITE_API_URL}/products`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, products]);

  // ✅ Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const currentPageItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);

    try {
      toast.loading("Uploading image...", { id: "upload" });
      const res = await axios.post(CLOUDINARY_URL, data);
      toast.success("Image uploaded!", { id: "upload" });
      return res.data.secure_url;
    } catch (err) {
      toast.error("Image upload failed", { id: "upload" });
      console.error(err);
      return null;
    }
  };

  // ✅ Create or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) return;
      }

      const payload = { ...formData, image: imageUrl };

      if (editingProduct) {
        await axios.put(`${VITE_API_URL}/products/${editingProduct._id}`, payload);
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${VITE_API_URL}/products`, payload);
        toast.success("Product added successfully!");
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        image: "",
      });
      setImageFile(null);
      fetchProducts();
    } catch (err) {
      toast.error("Error saving product");
      console.error(err);
    }
  };

  // ✅ Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${VITE_API_URL}/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      toast.error("Error deleting product");
      console.error(err);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setFormData({
              name: "",
              brand: "",
              category: "",
              price: "",
              stock: "",
              image: "",
            });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="flex items-center mb-4 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full md:w-1/3">
        <Search className="text-gray-500 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent focus:outline-none w-full dark:text-gray-100"
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-gray-500" size={30} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.length > 0 ? (
                currentPageItems.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={p.image || "/placeholder.jpg"}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.brand}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3">{p.stock}</td>
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
                    colSpan="7"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 📄 Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🧾 Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {["name", "brand", "category", "price", "stock"].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {f}
                  </label>
                  <input
                    type={f === "price" || f === "stock" ? "number" : "text"}
                    name={f}
                    value={formData[f]}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              ))}

              {/* 🖼 Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
