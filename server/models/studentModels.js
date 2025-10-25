// models/studentModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  course: {     
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  dateOfAdmission: {
    type: Date,
    default: Date.now  
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
