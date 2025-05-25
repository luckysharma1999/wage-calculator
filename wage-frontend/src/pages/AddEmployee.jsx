import { useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";

export default function AddEmployee() {
  const [form, setForm] = useState({ name: "", empId: "", baseSalary: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/add", form);
    alert("Employee Added");
    setForm({ name: "", empId: "", baseSalary: 0 });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-lg mx-auto w-full">
      <BackButton />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Employee ID</label>
          <input
            className="border p-2 w-full rounded"
            value={form.empId}
            onChange={(e) => setForm({ ...form, empId: e.target.value })}
          />
        </div>
        <div className="relative">
          <label className="absolute left-3 top-1 text-sm text-gray-500 pointer-events-none">
            Monthly Salary (₹)
          </label>
          <input
            type="number"
            className="pt-6 border p-2 w-full rounded"
            value={form.baseSalary}
            onChange={(e) =>
              setForm({ ...form, baseSalary: Number(e.target.value) })
            }
          />
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full">
          Add Employee
        </button>
      </form>
    </div>
  );
}
