import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="text-blue-600 text-sm underline mb-4 block"
    >
      ← Back
    </button>
  );
}
