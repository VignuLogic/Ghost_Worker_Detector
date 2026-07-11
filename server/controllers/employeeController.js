const Employee = require("../models/Employee");

const registerEmployee = async (req, res) => {
  try {
    const { name, phone, role, dailyWage, joiningDate, workplaceLocation } = req.body;

    if (!name || !phone || !role || !dailyWage || !workplaceLocation) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const existing = await Employee.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "An employee with this phone number already exists." });
    }

    const employee = await Employee.create({ name, phone, role, dailyWage, joiningDate, workplaceLocation });
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerEmployee, getEmployees, getEmployeeById };   