import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";

export default function ViewSalary() {
  const { id } = useParams();
  const [salary, setSalary] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );

  const fetchData = async () => {
    const [salaryRes, allEmpRes] = await Promise.all([
      API.get(`/salary/${id}?month=${month}`),
      API.get(`/`),
    ]);
    setSalary(salaryRes.data);
    const emp = allEmpRes.data.find((e) => e._id === id);
    setEmployee(emp);
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  if (!salary || !employee) return <p className="text-center">Loading...</p>;

  // Filter records by selected month
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const attendance = employee.attendance.filter((a) => {
    const d = new Date(a.date);
    return d >= startDate && d < endDate;
  });

  const advances = employee.advances.filter((a) => {
    const d = new Date(a.date);
    return d >= startDate && d < endDate;
  });

  const present = attendance.filter((a) => a.status === "present").length;
  const leave = attendance.filter((a) => a.status === "leave");
  const half = attendance.filter((a) => a.status === "half-day").length;

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-lg mx-auto w-full">
      <BackButton />
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-600">
        Salary Summary
      </h2>

      <div className="mb-4 text-center">
        <label className="block text-sm font-medium mb-1">Select Month</label>
        <input
          type="month"
          className="border p-2 rounded w-full sm:w-64"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <div className="space-y-2 mb-4">
        <p>Gross Pay: ₹{salary.grossPay}</p>
        <p>Leave Deductions: ₹{salary.leaveDeductions}</p>
        <p>Advances Taken: ₹{salary.advancesTaken}</p>
        <p>Total Deductions: ₹{salary.totalDeductions}</p>
        <p className="font-bold text-emerald-600">Net Pay: ₹{salary.netPay}</p>
      </div>

      <div className="text-sm bg-gray-50 p-3 rounded shadow-inner space-y-2">
        <h3 className="font-semibold text-slate-700">📊 Attendance Summary</h3>
        <p>✅ Present Days: {present}</p>
        <p>❌ Leave Days: {leave.length}</p>
        {leave.length > 0 && (
          <ul className="list-disc list-inside text-slate-500">
            {leave.map((l, i) => (
              <li key={i}>
                {new Date(l.date).toLocaleDateString()} -{" "}
                {l.remark || "No remark"}
              </li>
            ))}
          </ul>
        )}
        <p>🌓 Half Days: {half}</p>

        <h3 className="font-semibold mt-4 text-slate-700">
          💰 Advance History
        </h3>
        {advances.length === 0 ? (
          <p>No advances recorded.</p>
        ) : (
          <ul className="list-disc list-inside text-slate-500">
            {advances.map((adv, i) => (
              <li key={i}>
                {new Date(adv.date).toLocaleDateString()} – ₹{adv.amount} (
                {adv.reason || "No reason"})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
