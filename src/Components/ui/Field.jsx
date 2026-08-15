import { forwardRef } from "react";

import { FiChevronDown } from "react-icons/fi";

const baseField =
  "w-full rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-subtle transition-all duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/35 disabled:opacity-60 disabled:bg-surface-hover";

function FieldLabel({ label, hint, htmlFor }) {
  if (!label && !hint) return null;
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {hint && <span className="text-xs text-subtle">{hint}</span>}
    </div>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{error}</p>;
}

export const Input = forwardRef(function Input(
  { label, hint, error, className = "", ...props },
  ref
) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div>
      <FieldLabel label={label} hint={hint} htmlFor={id} />
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={`${baseField} h-11 px-3.5 ${error ? "border-danger focus:border-danger focus:ring-danger/25" : ""} ${className}`}
        {...props}
      />
      <FieldError error={error} />
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, className = "", rows = 4, ...props },
  ref
) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div>
      <FieldLabel label={label} hint={hint} htmlFor={id} />
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={`${baseField} px-3.5 py-2.5 ${error ? "border-danger focus:border-danger focus:ring-danger/25" : ""} ${className}`}
        {...props}
      />
      <FieldError error={error} />
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, hint, error, className = "", children, ...props },
  ref
) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  return (
    <div>
      <FieldLabel label={label} hint={hint} htmlFor={id} />
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={`${baseField} h-11 appearance-none pl-3.5 pr-9 ${error ? "border-danger focus:border-danger focus:ring-danger/25" : ""} ${className}`}
          {...props}
        >
          {children}
        </select>
        <FiChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-subtle"
        />
      </div>
      <FieldError error={error} />
    </div>
  );
});
