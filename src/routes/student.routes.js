const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// add student
router.post('/', studentController.addStudent);

module.exports = router