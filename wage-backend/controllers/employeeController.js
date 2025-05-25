const Employee = require("../models/Employee");

exports.addEmployee = async (req, res) => {
  try {
    const { name, empId, baseSalary } = req.body;

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const dailyWage = Math.round(baseSalary / daysInMonth);
    const todayFormatted = now.toISOString().split("T")[0];

    const newEmp = new Employee({
      name,
      empId,
      baseSalary,
      dailyWage,
      attendance: [{ date: todayFormatted, status: "present" }],
    });

    await newEmp.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    for (const entry of records) {
      employee.attendance.push({
        date: new Date(entry.date),
        status: entry.status,
        remark: entry.remark || "",
      });
    }

    await employee.save();
    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAdvance = async (req, res) => {
  try {
    const { date, amount, reason } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    employee.advances.push({ date: new Date(date), amount, reason });
    await employee.save();
    res.json({ message: "Advance recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateSalary = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const { month } = req.query;
    let startDate = null;
    let endDate = null;

    if (month) {
      const [year, mon] = month.split("-").map(Number);
      startDate = new Date(Date.UTC(year, mon - 1, 0, 23, 59, 59, 999));
      endDate = new Date(Date.UTC(year, mon, 0, 23, 59, 59, 999));
    }

    const filteredAttendance = employee.attendance.filter((a) => {
      const date = new Date(a.date);
      return !startDate || (date > startDate && date <= endDate);
    });

    const filteredAdvances = employee.advances.filter((adv) => {
      const date = new Date(adv.date);
      return !startDate || (date > startDate && date <= endDate);
    });

    const presentDays = filteredAttendance.filter(
      (a) => a.status === "present"
    ).length;
    const leaveDays = filteredAttendance.filter(
      (a) => a.status === "leave"
    ).length;
    const halfDays = filteredAttendance.filter(
      (a) => a.status === "half-day"
    ).length;

    const advancesTaken = filteredAdvances.reduce(
      (sum, adv) => sum + adv.amount,
      0
    );
    const grossPay = (presentDays + 0.5 * halfDays) * employee.dailyWage;
    const leaveDeductions = leaveDays * employee.dailyWage;
    const totalDeductions = leaveDeductions + advancesTaken;
    const netPay = grossPay - totalDeductions;

    res.json({
      grossPay: Math.round(grossPay),
      leaveDeductions: Math.round(leaveDeductions),
      advancesTaken: Math.round(advancesTaken),
      totalDeductions: Math.round(totalDeductions),
      netPay: Math.round(netPay),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
