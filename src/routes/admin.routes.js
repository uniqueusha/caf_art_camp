const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

//add user
router.post('/', adminController.addUser);
//login
router.post('/login', adminController.userLogin);
// get active state
router.get('/active-state-list', adminController.getStateWma);
// get active city
router.get('/active-city-list', adminController.getCityWma);
// get active bloodgroup
router.get('/active-bloodgroup-list' , adminController.getBloodgroupWma);
//get active course
router.get('/active-course-list', adminController.getCourseWma);
//get active gender
router.get('/active-gender-list', adminController.getGenderWma);

module.exports = router