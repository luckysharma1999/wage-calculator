import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";

export default function AddAdvance() {
  const { id } = useParams();
  const [form, setForm] = useState({ date: "", amount: "", reason: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post(`/advance/${id}`, form);
    alert("Advance added");
    setForm({ date: "", amount: 0, reason: "" });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-lg mx-auto w-full">
      <BackButton />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Amount (₹)</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Reason</label>
          <input
            className="border p-2 w-full rounded"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full">
          Add Advance
        </button>
      </form>
    </div>
  );
}
