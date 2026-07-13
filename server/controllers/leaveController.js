const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

// @desc   Apply for leave
// @route  POST /api/leaves
const applyLeave = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;

    if (!employeeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const leave = await Leave.create({
      employee: employeeId,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Approve or reject leave
// @route  PUT /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected." });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave record not found." });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all leaves
// @route  GET /api/leaves
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name phone role")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Check if employee checked in during approved leave (fraud)
// @route  GET /api/leaves/fraud-check/:employeeId
const checkLeaveAttendanceFraud = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // get all approved leaves for this employee
    const approvedLeaves = await Leave.find({
      employee: employeeId,
      status: "approved",
    });

    const fraudFlags = [];

    for (const leave of approvedLeaves) {
      // check if any attendance exists during this leave period
     const leaveEnd = new Date(leave.endDate);
     leaveEnd.setHours(23, 59, 59, 999);

     const suspiciousAttendance = await Attendance.find({
        employee: employeeId,
        date: {
            $gte: leave.startDate,
            $lte: leaveEnd,
        },
});

      if (suspiciousAttendance.length > 0) {
        fraudFlags.push({
          leaveId: leave._id,
          leavePeriod: `${leave.startDate} to ${leave.endDate}`,
          attendanceFound: suspiciousAttendance.length,
          message: "Attendance marked during approved leave — possible fraud",
        });
      }
    }

    if (fraudFlags.length === 0) {
      return res.json({ message: "No fraud detected in leave records.", fraudFlags: [] });
    }

    res.json({ message: "Fraud detected!", fraudFlags });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { applyLeave, updateLeaveStatus, getAllLeaves, checkLeaveAttendanceFraud };