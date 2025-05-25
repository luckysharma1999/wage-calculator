const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  markAttendance,
  addAdvance,
  calculateSalary,
  deleteEmployee,
} = require("../controllers/employeeController");

router.post("/add", addEmployee);
router.get("/", getAllEmployees);
router.post("/attendance/:id", markAttendance);
router.post("/advance/:id", addAdvance);
router.get("/salary/:id", calculateSalary);
router.delete("/:id", deleteEmployee);

module.exports = router;
