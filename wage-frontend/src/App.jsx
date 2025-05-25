import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddEmployee from "./pages/AddEmployee";
import MarkAttendance from "./pages/MarkAttendance";
import AddAdvance from "./pages/AddAdvance";
import ViewSalary from "./pages/ViewSalary";
import EmployeeList from "./pages/EmployeeList";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-black-700">
          SPFS (wage-calculator)
        </h1>
        <Navbar />
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/attendance/:id" element={<MarkAttendance />} />
          <Route path="/advance/:id" element={<AddAdvance />} />
          <Route path="/salary/:id" element={<ViewSalary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
