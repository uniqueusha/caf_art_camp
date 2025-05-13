const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// add student
router.post('/', studentController.addStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudent);
module.exports = router