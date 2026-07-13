const express = require("express");
const router = express.Router();
const {
  applyLeave,
  updateLeaveStatus,
  getAllLeaves,
  checkLeaveAttendanceFraud,
} = require("../controllers/leaveController");

router.post("/", applyLeave);
router.put("/:id", updateLeaveStatus);
router.get("/", getAllLeaves);
router.get("/fraud-check/:employeeId", checkLeaveAttendanceFraud);

module.exports = router;