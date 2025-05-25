import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";
import { format, addDays } from "date-fns";

export default function MarkAttendanceCalendar() {
  const { id } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );
  const [dates, setDates] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedMonth) return;

      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));

      const days = [];
      for (
        let d = new Date(startDate);
        d < endDate;
        d.setUTCDate(d.getUTCDate() + 1)
      ) {
        const day = new Date(d);
        const dateStr = day.toISOString().split("T")[0];
        days.push({
          date: dateStr,
          status: "",
          remark: "",
          disabled: dateStr > today,
        });
      }

      const res = await API.get(`/`);
      const emp = res.data.find((e) => e._id === id);

      if (emp) {
        const updated = days.map((d) => {
          const saved = emp.attendance.find(
            (a) => a.date.split("T")[0] === d.date
          );
          return saved
            ? { ...d, status: saved.status, remark: saved.remark }
            : d;
        });
        setDates(updated);
      }
    };

    fetchAttendance();
  }, [selectedMonth, id, today]);

  const updateStatus = (i, status) => {
    if (dates[i].disabled) return;
    const copy = [...dates];
    copy[i].status = status;
    if (status !== "leave") copy[i].remark = "";
    setDates(copy);
  };

  const updateRemark = (i, value) => {
    const copy = [...dates];
    copy[i].remark = value;
    setDates(copy);
  };

  const markAllPresent = () => {
    const updated = dates.map((d) =>
      d.disabled ? d : { ...d, status: "present", remark: "" }
    );
    setDates(updated);
  };

  const resetAll = () => {
    const updated = dates.map((d) =>
      d.disabled ? d : { ...d, status: "", remark: "" }
    );
    setDates(updated);
  };

  const handleSubmit = async () => {
    await API.post(`/attendance/${id}`, {
      records: dates.filter((d) => !d.disabled),
    });
    alert("Attendance submitted!");
  };

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-5xl mx-auto">
      <BackButton />
      <h2 className="text-xl font-bold text-indigo-600 mb-4 text-center">
        Monthly Attendance (Calendar View)
      </h2>

      <div className="mb-4 text-center">
        <label className="block text-sm font-medium mb-1">Select Month</label>
        <input
          type="month"
          className="border p-2 rounded w-full sm:w-64"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={markAllPresent}
          className="bg-emerald-600 text-white px-4 py-1 rounded"
        >
          ✅ Mark All Present
        </button>
        <button
          onClick={resetAll}
          className="bg-gray-400 text-white px-4 py-1 rounded"
        >
          ♻️ Reset All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {dates.map((entry, i) => (
          <div
            key={entry.date}
            className={`p-2 border rounded shadow-sm ${
              entry.disabled ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div className="font-medium mb-1 text-center">
              {new Date(entry.date).toDateString()}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {["present", "leave", "half-day"].map((status) => (
                <button
                  key={status}
                  disabled={entry.disabled}
                  onClick={() => updateStatus(i, status)}
                  className={`text-sm px-2 py-1 rounded ${
                    entry.status === status
                      ? status === "present"
                        ? "bg-green-600 text-white"
                        : status === "leave"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {status === "present"
                    ? "✅"
                    : status === "leave"
                    ? "❌"
                    : "🌓"}
                </button>
              ))}
            </div>
            {entry.status === "leave" && !entry.disabled && (
              <input
                type="text"
                placeholder="Leave remark"
                className="mt-2 p-1 border w-full rounded"
                value={entry.remark}
                onChange={(e) => updateRemark(i, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="block mt-6 mx-auto px-6 py-2 bg-indigo-600 text-white rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
}
