import React, { useEffect, useState } from "react";
import { createStudent, getAllStudent, updateStudent, deleteStudent } from "../../service/allApis";

const initialForm = {
  name: "",
  email: "",
  course: "",
  age: "",
};

const StudentMangement = () => {
  const [formData, setFormData] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAll = async () => {
    try {
      const res = await getAllStudent();
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.age) newErrors.age = "Age is required";
    else if (formData.age <= 0) newErrors.age = "Age must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) await updateStudent(editId, formData);
      else await createStudent(formData);

      setFormData(initialForm);
      setEditId(null);
      setErrors({});
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      age: student.age,
    });
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      await deleteStudent(id);
      fetchAll();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🎓 Student Management</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <button onClick={() => setSearchTerm(search)} className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Search
        </button>
      </div>

     
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Course"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
          {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="border p-2 rounded-lg w-full"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg col-span-full">
          {editId ? "Update" : "Add"} Student
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border font-semibold">Name</th>
              <th className="p-3 border font-semibold">Email</th>
              <th className="p-3 border font-semibold">Course</th>
              <th className="p-3 border font-semibold">Age</th>
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
                  <td className="p-3 border">{student.age}</td>
                  <td className="p-3 border">
                    <button onClick={() => handleEdit(student)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(student._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
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

export default StudentMangement;
