import React, { useEffect, useState } from "react";
import { createEmployee, getAllEmployees, updateEmployee, deleteEmployee } from "../../services/allApis";
import { toast } from "react-toastify"; 


const initialForm = {
  name: "",
  email: "",
  position: "",
  department: "",
  salary: "",
};

const EmployeeManagement = () => {
  const [formData, setFormData] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchAll = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Enter name";
    if (!formData.email) newErrors.email = "Enter email";
    if (!formData.position) newErrors.position = "Enter position";
    if (!formData.department) newErrors.department = "Enter department";
    if (!formData.salary) newErrors.salary = "Enter salary";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editId) {
        await updateEmployee(editId, formData);
        toast.success("✅ Employee updated successfully!");
      } else {
        await createEmployee(formData);
        toast.success("🎉 Employee added successfully!");
      }

      setFormData(initialForm);
      setEditId(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save employee");
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp._id);
    setFormData({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      department: emp.department,
      salary: emp.salary,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      try {
        await deleteEmployee(id);
        toast.success("🗑️ Employee deleted successfully!");
        fetchAll();
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to delete employee");
      }
    }
  };

  const handleSort = () => {
    const sorted = [...employees].sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      else return b.name.localeCompare(a.name);
    });
    setEmployees(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🏢 Employee Management System</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <button onClick={handleSort} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Sort ({sortOrder === "asc" ? "A→Z" : "Z→A"})
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {["name", "email", "position", "department", "salary"].map((field) => (
          <div key={field}>
            <input
              type={field === "email" ? "email" : field === "salary" ? "number" : "text"}
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
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg col-span-full"
        >
          {editId ? "Update" : "Add"} Employee
        </button>
      </form>

      <table className="w-full border border-gray-300 rounded-lg text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Position</th>
            <th className="p-3 border">Department</th>
            <th className="p-3 border">Salary</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
            .map((emp) => (
              <tr key={emp._id} className="even:bg-gray-50">
                <td className="p-3 border">{emp.name}</td>
                <td className="p-3 border">{emp.email}</td>
                <td className="p-3 border">{emp.position}</td>
                <td className="p-3 border">{emp.department}</td>
                <td className="p-3 border">₹{emp.salary}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
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
  );
};

export default EmployeeManagement;
