const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getEmployeeAttendance,
  getAllAttendance,
  getQRCode,
} = require("../controllers/attendanceController");

router.get("/qr/generate", getQRCode);
router.post("/", markAttendance);
router.get("/", getAllAttendance);
router.get("/:employeeId", getEmployeeAttendance);

module.exports = router;