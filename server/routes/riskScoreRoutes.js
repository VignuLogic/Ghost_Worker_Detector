const express = require("express");
const router = express.Router();
const {
  calculateRiskScore,
  calculateAllRiskScores,
} = require("../controllers/riskScoreController");

router.get("/all", calculateAllRiskScores);
router.get("/:employeeId", calculateRiskScore);

module.exports = router;