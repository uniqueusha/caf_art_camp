const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// add student
router.post('/', studentController.addStudent);
router.get('/', studentController.getStudents);
router.get('/download', studentController.getStudentDownload);
router.get('/student-count', studentController.getStudentsCount);
router.get('/datewise-student-count', studentController.getMonthWiseStudentsCount);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudent);
router.patch('/:id', studentController.onStatusChange);
module.exports = router