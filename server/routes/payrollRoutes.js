const express = require("express");
const router = express.Router();
const {
  addPayroll,
  getAllPayroll,
  getFlaggedPayroll,
} = require("../controllers/payrollController");

router.post("/", addPayroll);
router.get("/", getAllPayroll);
router.get("/flagged", getFlaggedPayroll);

module.exports = router;