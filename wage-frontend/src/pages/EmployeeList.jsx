import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-4">
      {employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div
            key={emp._id}
            className="bg-white border rounded shadow-sm p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <div>
              <h2 className="font-bold text-indigo-700">
                {emp.name} ({emp.empId})
              </h2>
              <p>Monthly Salary: ₹{emp.baseSalary}</p>
              <p className="text-sm text-gray-500">
                Daily Wage: ₹{emp.dailyWage || 0}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Link
                to={`/attendance/${emp._id}`}
                className="bg-emerald-500 text-white px-3 py-1 rounded text-sm w-full sm:w-auto text-center"
              >
                Attendance
              </Link>
              <Link
                to={`/advance/${emp._id}`}
                className="bg-indigo-500 text-white px-3 py-1 rounded text-sm w-full sm:w-auto text-center"
              >
                Advance
              </Link>
              <Link
                to={`/salary/${emp._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-full sm:w-auto text-center"
              >
                Salary
              </Link>
              <button
                onClick={() => deleteEmployee(emp._id)}
                className="bg-rose-500 text-white px-3 py-1 rounded text-sm w-full sm:w-auto text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
