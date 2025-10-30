import React, { useEffect, useState } from "react";
import { createTask, getTasks, updateTask, deleteTask } from "../../services/allApis";
import { toast } from "react-toastify"; // ✅ Import Toastify


const initialForm = {
  title: "",
  description: "",
  priority: "Low",
  status: "Pending",
};

const TaskTracker = () => {
  const [formData, setFormData] = useState(initialForm);
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Submit / Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return toast.error("⚠️ Please fill all fields");
    }

    try {
      if (editId) {
        await updateTask(editId, formData);
        toast.success("✅ Task updated successfully!");
      } else {
        await createTask(formData);
        toast.success("🎉 Task added successfully!");
      }

      setFormData(initialForm);
      setEditId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save task");
    }
  };

  // ✅ Edit task
  const handleEdit = (task) => {
    setEditId(task._id);
    setFormData(task);
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("🗑️ Task deleted successfully!");
        fetchTasks();
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to delete task");
      }
    }
  };

  // ✅ Filtering logic
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filter === "All" || task.status === filter;
    const priorityMatch = priorityFilter === "All" || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const completion = total ? ((done / total) * 100).toFixed(0) : 0;

  const getColor = (status) => {
    switch (status) {
      case "Done":
        return "text-green-600 font-semibold";
      case "In Progress":
        return "text-yellow-600 font-semibold";
      default:
        return "text-red-600 font-semibold";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🗂️ Task Tracker App</h1>

      {/* 🔽 Filters */}
      <div className="flex justify-between mb-4 flex-wrap gap-4">
        <div>
          <label className="mr-2 font-semibold">Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Filter by Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      {/* 🧾 Task Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {["title", "description"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
        ))}

        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="border p-2 rounded-lg"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="border p-2 rounded-lg"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg col-span-full"
        >
          {editId ? "Update" : "Add"} Task
        </button>
      </form>

      {/* 📊 Summary */}
      <p className="mb-4 font-semibold">
        Total Tasks: {total} | Done: {done} | Completion: {completion}%
      </p>

      {/* 📋 Task Table */}
      <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Priority</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id} className="even:bg-gray-50">
              <td className="p-3 border">{task.title}</td>
              <td className="p-3 border">{task.description}</td>
              <td className="p-3 border">{task.priority}</td>
              <td className={`p-3 border ${getColor(task.status)}`}>{task.status}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-gray-500">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>

 
    </div>
  );
};

export default TaskTracker;
