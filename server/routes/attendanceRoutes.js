const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getEmployeeAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");

router.post("/", markAttendance);
router.get("/", getAllAttendance);
router.get("/:employeeId", getEmployeeAttendance);

module.exports = router;