
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function SignUpShell({ title, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
      <header className="mx-auto mb-6 flex w-full max-w-6xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/SignUp")}
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted shadow-card transition-colors hover:text-primary"
          aria-label="Back to role selection"
        >
          <FiArrowLeft size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Choose role</span>
        </button>
        <img src="/Logo.png" alt="Medorc Logo" className="h-11 w-auto" />
        <h2 className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </header>
      {children}
    </div>
  );
}
