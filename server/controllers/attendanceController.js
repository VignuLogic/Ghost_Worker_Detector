const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { isTokenValid, generateQRCode } = require("../utils/qrGenerator");

// calculate distance between two GPS points in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// @desc   Mark attendance for an employee
// @route  POST /api/attendance
const markAttendance = async (req, res) => {
  try {
    const { employeeId, deviceId, location, qrToken } = req.body;

    if (!employeeId || !deviceId || !location || !qrToken) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    if (!isTokenValid(qrToken)) {
      return res.status(400).json({ message: "QR code expired or invalid. Please rescan." });
    }

    // check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Attendance.findOne({
      employee: employeeId,
      date: { $gte: today },
    });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }

    // check same device used by multiple employees today
    const deviceConflict = await Attendance.findOne({
      deviceId,
      date: { $gte: today },
      employee: { $ne: employeeId },
    });

    // check if within geofence (100 meter radius)
    const distance = getDistance(
      location.latitude,
      location.longitude,
      employee.workplaceLocation.latitude,
      employee.workplaceLocation.longitude
    );
    const isWithinGeofence = distance <= 100;

    // mark suspicious if device conflict or outside geofence
    const status = deviceConflict || !isWithinGeofence ? "suspicious" : "present";

    const attendance = await Attendance.create({
      employee: employeeId,
      date: new Date(),
      checkInTime: new Date(),
      deviceId,
      location,
      isWithinGeofence,
      status,
    });

    res.status(201).json({
      attendance,
      warnings: {
        deviceConflict: !!deviceConflict,
        outsideGeofence: !isWithinGeofence,
        distanceFromSite: `${Math.round(distance)} meters`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get attendance for a specific employee
// @route  GET /api/attendance/:employeeId
const getEmployeeAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.params.employeeId })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all attendance records
// @route  GET /api/attendance
const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("employee", "name phone role")
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc   Get the current live QR code (owner's display screen calls this)
// @route  GET /api/attendance/qr/generate
const getQRCode = async (req, res) => {
  try {
    const { token, qrDataURL, expiresIn } = await generateQRCode();
    res.json({ token, qrDataURL, expiresIn });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { markAttendance, getEmployeeAttendance, getAllAttendance, getQRCode };

