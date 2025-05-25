import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-6">
      <Link to="/" className="text-blue-600 underline">
        Employees
      </Link>
      <Link to="/add" className="text-blue-600 underline">
        Add Employee
      </Link>
    </nav>
  );
}
