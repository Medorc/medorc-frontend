
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function BackButton({ title = "Profile & Settings", showTitle = true }) {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="relative flex h-14 w-full items-center justify-center px-2 sm:h-16 sm:px-8">
      <button
        type="button"
        className="group absolute left-2 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary shadow-card transition-all duration-200 hover:border-primary/40 hover:bg-primary-soft sm:left-8 sm:px-5"
        onClick={() => navigate(`/${role || "patient"}/home`)}
        aria-label="Go Back"
      >
        <FiArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
        <span className="hidden sm:inline">Back</span>
      </button>
      {showTitle && (
        <h1 className="max-w-full truncate px-12 font-display text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
      )}
    </div>
  );
}
