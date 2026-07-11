const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true },
    dailyWage: { type: Number, required: true },
    joiningDate: { type: Date, required: true, default: Date.now },
    workplaceLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    ghostRiskScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);