const express = require("express");
const router = express.Router();
const { registerEmployee, getEmployees, getEmployeeById, updateEmployee } = require("../controllers/employeeController");

router.post("/", registerEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);

module.exports = router;