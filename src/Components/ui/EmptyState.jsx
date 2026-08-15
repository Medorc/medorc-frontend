
import { FiInbox } from "react-icons/fi";

export function EmptyState({ icon = FiInbox, title, description, action, className = "" }) {
  const Icon = icon;
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-hover text-subtle">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
