const express = require("express");
const router = express.Router();
const { registerEmployee, getEmployees, getEmployeeById } = require("../controllers/employeeController");

router.post("/", registerEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

module.exports = router;