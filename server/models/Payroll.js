const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true, // 1-12
    },
    year: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    daysWorked: {
      type: Number,
      default: 0, // will be calculated from attendance
    },
    expectedAmount: {
      type: Number,
      default: 0, // dailyWage * daysWorked
    },
    discrepancy: {
      type: Boolean,
      default: false, // true if amountPaid != expectedAmount
    },
    flagged: {
      type: Boolean,
      default: false, // true if salary paid but zero attendance
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);