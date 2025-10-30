import React, { useEffect, useState } from "react";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getTotalStockValue,
} from "../../services/allApis";

const initialForm = {
  productName: "",
  price: "",
  quantity: "",
  category: "",
};

const ProductInventory = () => {
  const [formData, setFormData] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [sort, setSort] = useState("");
  const [totalValue, setTotalValue] = useState(0);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const query = [];
      if (filters.search) query.push(`search=${filters.search}`);
      if (filters.category) query.push(`category=${filters.category}`);
      if (sort) query.push(`sort=${sort}`);

      const res = await getAllProducts(query.length ? `?${query.join("&")}` : "");
      const data = res?.data?.products || res?.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  // ✅ Fetch total stock value
  const fetchTotalValue = async () => {
    try {
      const res = await getTotalStockValue();
      setTotalValue(res?.data?.totalStockValue || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTotalValue();
  }, []);

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productName || !formData.price || !formData.quantity)
      return alert("Please fill all fields");

    try {
      if (editId) await updateProduct(editId, formData);
      else await createProduct(formData);

      setFormData(initialForm);
      setEditId(null);
      fetchProducts();
      fetchTotalValue();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  // ✅ Edit product
  const handleEdit = (prod) => {
    setEditId(prod._id);
    setFormData({
      productName: prod.productName,
      price: prod.price,
      quantity: prod.quantity,
      category: prod.category,
    });
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
      fetchTotalValue();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🛍️ Product Inventory System</h1>

      {/* 💰 Total Stock Value */}
      <div className="bg-blue-100 text-center p-3 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">
          Total Stock Value: ₹{totalValue.toLocaleString()}
        </h2>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
        </select>
        <button
          onClick={fetchProducts}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Apply
        </button>
      </div>

      {/* 🧾 Product Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
      >
        {["productName", "price", "quantity", "category"].map((field) => (
          <input
            key={field}
            type={
              field === "price" || field === "quantity" ? "number" : "text"
            }
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg col-span-full"
        >
          {editId ? "Update" : "Add"} Product
        </button>
      </form>

      {/* 📦 Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border font-semibold">Product Name</th>
              <th className="p-3 border font-semibold">Price</th>
              <th className="p-3 border font-semibold">Quantity</th>
              <th className="p-3 border font-semibold">Category</th>
              <th className="p-3 border font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr
                key={prod._id}
                className={`even:bg-gray-50 ${
                  prod.quantity === 0
                    ? "bg-red-200"
                    : prod.quantity < 5
                    ? "bg-yellow-100"
                    : ""
                }`}
              >
                <td className="p-3 border">{prod.productName}</td>
                <td className="p-3 border">₹{prod.price}</td>
                <td className="p-3 border">{prod.quantity}</td>
                <td className="p-3 border">{prod.category}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductInventory;
