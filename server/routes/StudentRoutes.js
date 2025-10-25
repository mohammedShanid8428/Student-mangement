const express = require('express');
const studentController = require('../controller/studentController');
const router = express.Router();

router.post('/student', studentController.createStudent);
router.get('/student', studentController.getAllStudents);
router.put('/student/:id', studentController.updateStudent);
router.delete('/student/:id', studentController.deleteStudent);

module.exports = router;
