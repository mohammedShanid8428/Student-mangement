import React, { useEffect, useState } from "react";
import {
  createStudent,
  getAllStudent,
  updateStudent,
  deleteStudent,
} from "../../services/allApis";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  name: "",
  email: "",
  course: "",
  batch: "",
  grade: "",
};

const StudentManagement = () => {
  const [formData, setFormData] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch all students
  const fetchAll = async () => {
    try {
      const res = await getAllStudent();
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching:", err);
      if (err.response?.status === 401) {
        toast.warning("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else if (err.message === "Network Error") {
        toast.error("Server not reachable. Check if backend is running.");
      } else {
        toast.error("Failed to fetch students");
      }
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔹 Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Enter name";
    if (!formData.email) newErrors.email = "Enter email";
    if (!formData.course) newErrors.course = "Enter course";
    if (!formData.batch) newErrors.batch = "Enter batch";
    if (!formData.grade) newErrors.grade = "Enter grade";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Create or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) {
        await updateStudent(editId, formData);
        toast.success("✅ Student updated successfully!");
      } else {
        await createStudent(formData);
        toast.success("🎉 Student added successfully!");
      }

      setFormData(initialForm);
      setEditId(null);
      setErrors({});
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save student");
    }
  };

  // 🔹 Edit handler
  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      batch: student.batch,
      grade: student.grade,
    });
    setErrors({});
  };

  // 🔹 Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await deleteStudent(id);
        toast.success("🗑️ Student deleted successfully!");
        fetchAll();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete student");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🎓 Student Management</h1>

  

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <button
          onClick={() => setSearchTerm(search)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {["name", "email", "course", "batch", "grade"].map((field) => (
          <div key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="border p-2 rounded-lg w-full"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg col-span-full"
        >
          {editId ? "Update" : "Add"} Student
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border font-semibold">Name</th>
              <th className="p-3 border font-semibold">Email</th>
              <th className="p-3 border font-semibold">Course</th>
              <th className="p-3 border font-semibold">Batch</th>
              <th className="p-3 border font-semibold">Grade</th>
              <th className="p-3 border font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((student) => (
                <tr key={student._id} className="even:bg-gray-50">
                  <td className="p-3 border">{student.name}</td>
                  <td className="p-3 border">{student.email}</td>
                  <td className="p-3 border">{student.course}</td>
                  <td className="p-3 border">{student.batch}</td>
                  <td className="p-3 border">{student.grade}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
