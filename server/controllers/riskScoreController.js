const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");

const calculateRiskScore = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    let score = 0;
    const reasons = [];

    // check 1 — suspicious attendance records
    const suspiciousAttendance = await Attendance.find({
      employee: employeeId,
      status: "suspicious",
    });
    if (suspiciousAttendance.length > 0) {
      score += suspiciousAttendance.length * 15;
      reasons.push(`${suspiciousAttendance.length} suspicious check-in(s) detected (+${suspiciousAttendance.length * 15} points)`);
    }

    // check 2 — outside geofence check-ins
    const outsideGeofence = await Attendance.find({
      employee: employeeId,
      isWithinGeofence: false,
    });
    if (outsideGeofence.length > 0) {
      score += outsideGeofence.length * 20;
      reasons.push(`${outsideGeofence.length} check-in(s) outside geofence (+${outsideGeofence.length * 20} points)`);
    }

    // check 3 — attendance during approved leave
    const approvedLeaves = await Leave.find({
      employee: employeeId,
      status: "approved",
    });
    for (const leave of approvedLeaves) {
      const leaveEnd = new Date(leave.endDate);
      leaveEnd.setHours(23, 59, 59, 999);
      const attendanceDuringLeave = await Attendance.find({
        employee: employeeId,
        date: { $gte: leave.startDate, $lte: leaveEnd },
      });
      if (attendanceDuringLeave.length > 0) {
        score += 25;
        reasons.push(`Attendance marked during approved leave (+25 points)`);
      }
    }

    // check 4 — payroll flagged (salary paid, zero attendance)
    const flaggedPayroll = await Payroll.find({
      employee: employeeId,
      flagged: true,
    });
    if (flaggedPayroll.length > 0) {
      score += flaggedPayroll.length * 40;
      reasons.push(`${flaggedPayroll.length} month(s) with salary paid but zero attendance (+${flaggedPayroll.length * 40} points)`);
    }

    // cap score at 100
    score = Math.min(score, 100);

    // save score to employee
    await Employee.findByIdAndUpdate(employeeId, { ghostRiskScore: score });

    res.json({
      employee: employee.name,
      ghostRiskScore: score,
      riskLevel: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
      reasons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// calculate risk score for ALL employees at once
const calculateAllRiskScores = async (req, res) => {
  try {
    const employees = await Employee.find();
    const results = [];

    for (const emp of employees) {
      let score = 0;

      const suspiciousAttendance = await Attendance.find({ employee: emp._id, status: "suspicious" });
      score += suspiciousAttendance.length * 15;

      const outsideGeofence = await Attendance.find({ employee: emp._id, isWithinGeofence: false });
      score += outsideGeofence.length * 20;

      const approvedLeaves = await Leave.find({ employee: emp._id, status: "approved" });
      for (const leave of approvedLeaves) {
        const leaveEnd = new Date(leave.endDate);
        leaveEnd.setHours(23, 59, 59, 999);
        const attendanceDuringLeave = await Attendance.find({
          employee: emp._id,
          date: { $gte: leave.startDate, $lte: leaveEnd },
        });
        if (attendanceDuringLeave.length > 0) score += 25;
      }

      const flaggedPayroll = await Payroll.find({ employee: emp._id, flagged: true });
      score += flaggedPayroll.length * 40;

      score = Math.min(score, 100);
      await Employee.findByIdAndUpdate(emp._id, { ghostRiskScore: score });

      results.push({
        employee: emp.name,
        ghostRiskScore: score,
        riskLevel: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
      });
    }

    res.json({ message: "Risk scores updated for all employees", results });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { calculateRiskScore, calculateAllRiskScores };