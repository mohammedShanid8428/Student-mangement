const Student = require('../models/studentModels');

exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student created successfully", newStudent });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to create student", error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ message: "Students fetched successfully", students });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully", updated });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully", deleted });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
};
