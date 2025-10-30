import React, { useEffect, useState } from "react";
import {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
} from "../../services/allApis";

const initialForm = {
  title: "",
  amount: "",
  category: "",
  date: "",
};

const ExpenseTracker = () => {
  const [formData, setFormData] = useState(initialForm);
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ category: "", from: "", to: "" });
  const [total, setTotal] = useState(0);

s
const fetchExpenses = async () => {
  try {
    const query = [];
    if (filters.category) query.push(`category=${filters.category}`);
    if (filters.from && filters.to)
      query.push(`from=${filters.from}&to=${filters.to}`);

    const res = await getAllExpenses(query.length ? `?${query.join("&")}` : "");
   
    const data = res?.data?.expenses || res?.data || [];
    setExpenses(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error(err);
    alert("Failed to fetch expenses");
  }
};


  // ✅ Fetch total expenses
  const fetchTotal = async () => {
    try {
      const res = await getTotalExpenses();
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchTotal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category)
      return alert("Please fill all fields");

    try {
      if (editId) await updateExpense(editId, formData);
      else await createExpense(formData);

      setFormData(initialForm);
      setEditId(null);
      fetchExpenses();
      fetchTotal();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense");
    }
  };

  const handleEdit = (exp) => {
    setEditId(exp._id);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date.split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      await deleteExpense(id);
      fetchExpenses();
      fetchTotal();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">💰 Expense Tracker</h1>

      {/* 💵 Total Display */}
      <div className="bg-blue-100 text-center p-3 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Total Expenses: ₹{total}</h2>
      </div>

      {/* 🧾 Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <button
          onClick={fetchExpenses}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Filter
        </button>
      </div>

      {/* 📝 Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
      >
        {["title", "amount", "category", "date"].map((field) => (
          <input
            key={field}
            type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
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
          {editId ? "Update" : "Add"} Expense
        </button>
      </form>

      {/* 📋 Expense Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border font-semibold">Title</th>
              <th className="p-3 border font-semibold">Amount</th>
              <th className="p-3 border font-semibold">Category</th>
              <th className="p-3 border font-semibold">Date</th>
              <th className="p-3 border font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id} className="even:bg-gray-50">
                <td className="p-3 border">{exp.title}</td>
                <td className="p-3 border">₹{exp.amount}</td>
                <td className="p-3 border">{exp.category}</td>
                <td className="p-3 border">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTracker;
