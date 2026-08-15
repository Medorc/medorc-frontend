
import { FiAlertCircle } from "react-icons/fi";
import { Button } from "./Button";

export function ErrorState({ title = "Something went wrong", description, retry, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
        <FiAlertCircle size={26} aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {retry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={retry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
