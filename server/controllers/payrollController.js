const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// @desc   Add payroll entry for an employee
// @route  POST /api/payroll
const addPayroll = async (req, res) => {
  try {
    const { employeeId, month, year, amountPaid } = req.body;

    if (!employeeId || !month || !year || !amountPaid) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // count attendance days for this month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $gte: startDate, $lte: endDate },
      status: "present",
    });

    const daysWorked = attendanceRecords.length;
    const expectedAmount = employee.dailyWage * daysWorked;
    const discrepancy = amountPaid !== expectedAmount;
    const flagged = daysWorked === 0 && amountPaid > 0;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      amountPaid,
      daysWorked,
      expectedAmount,
      discrepancy,
      flagged,
    });

    res.status(201).json({
      payroll,
      summary: {
        daysWorked,
        expectedAmount,
        amountPaid,
        discrepancy,
        flagged,
        message: flagged
          ? "🚨 Salary paid but zero attendance — possible ghost worker!"
          : discrepancy
          ? "⚠️ Amount paid does not match expected salary"
          : "✅ Payroll looks clean",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all payroll records
// @route  GET /api/payroll
const getAllPayroll = async (req, res) => {
  try {
    const records = await Payroll.find()
      .populate("employee", "name phone role dailyWage")
      .sort({ year: -1, month: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get flagged payroll records
// @route  GET /api/payroll/flagged
const getFlaggedPayroll = async (req, res) => {
  try {
    const records = await Payroll.find({ flagged: true })
      .populate("employee", "name phone role dailyWage")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addPayroll, getAllPayroll, getFlaggedPayroll };
