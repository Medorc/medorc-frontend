
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function PageHeader({
  title,
  description,
  back,
  actions,
  className = "",
  icon: Icon,
}) {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3.5">
        {back && (
          <button
            type="button"
            onClick={() => (typeof back === "function" ? back() : navigate(-1))}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted shadow-card transition-all hover:-translate-x-0.5 hover:border-primary/40 hover:text-primary"
          >
            <FiArrowLeft size={18} aria-hidden="true" />
          </button>
        )}
        <div>
          {title && (
            <h1 className="flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight text-foreground">
              {Icon && <Icon size={22} className="text-primary" aria-hidden="true" />}
              {title}
            </h1>
          )}
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
