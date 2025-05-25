const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true, unique: true },
  baseSalary: { type: Number, required: true },
  dailyWage: { type: Number, required: true },
  joinDate: { type: Date, default: Date.now },
  attendance: [
    {
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["present", "leave", "half-day"],
        required: true,
      },
      remark: { type: String, default: "" },
    },
  ],
  advances: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      reason: { type: String },
    },
  ],
});

module.exports = mongoose.model("Employee", employeeSchema);
