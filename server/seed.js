const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // clear existing data
    await Employee.deleteMany();
    await Attendance.deleteMany();
    console.log("Existing data cleared...");

    // create employees
    const ramesh = await Employee.create({
      name: "Ramesh Kumar",
      phone: "9876543210",
      role: "Machine Operator",
      dailyWage: 500,
      joiningDate: new Date("2026-01-01"),
      workplaceLocation: { latitude: 23.0225, longitude: 72.5714 },
    });

    const suresh = await Employee.create({
      name: "Suresh Patel",
      phone: "9876543211",
      role: "Supervisor",
      dailyWage: 700,
      joiningDate: new Date("2026-01-01"),
      workplaceLocation: { latitude: 23.0225, longitude: 72.5714 },
    });

    const amit = await Employee.create({
      name: "Amit Shah",
      phone: "9876543212",
      role: "Helper",
      dailyWage: 400,
      joiningDate: new Date("2026-01-01"),
      workplaceLocation: { latitude: 23.0225, longitude: 72.5714 },
    });

    console.log("Employees created...");

    // create attendance records
    await Attendance.create({
      employee: ramesh._id,
      date: new Date(),
      checkInTime: new Date(),
      deviceId: "device-001",
      location: { latitude: 23.0225, longitude: 72.5714 },
      isWithinGeofence: true,
      status: "present",
    });

    // suresh - suspicious (device conflict, same device as ramesh)
    await Attendance.create({
      employee: suresh._id,
      date: new Date(),
      checkInTime: new Date(),
      deviceId: "device-001",
      location: { latitude: 23.0225, longitude: 72.5714 },
      isWithinGeofence: true,
      status: "suspicious",
    });

    // amit - suspicious (outside geofence, mumbai location)
    await Attendance.create({
      employee: amit._id,
      date: new Date(),
      checkInTime: new Date(),
      deviceId: "device-003",
      location: { latitude: 19.0760, longitude: 72.8777 },
      isWithinGeofence: false,
      status: "suspicious",
    });

    console.log("Attendance records created...");
    console.log("Seed data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();