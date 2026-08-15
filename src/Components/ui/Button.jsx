
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-primary text-white shadow-sm shadow-primary/25 hover:bg-primary-hover",
  secondary:
    "bg-slate-200/70 text-slate-700 hover:bg-slate-300/70 dark:bg-surface-hover dark:text-slate-200 dark:hover:bg-slate-700/60",
  outline:
    "border border-border bg-surface text-foreground hover:border-primary/50 hover:text-primary",
  ghost: "text-muted hover:bg-surface-hover hover:text-foreground",
  danger: "bg-danger text-white shadow-sm shadow-danger/25 hover:opacity-90",
  "danger-soft": "bg-danger-soft text-danger hover:opacity-90",
  primarySoft: "bg-primary-soft text-primary-soft-fg hover:opacity-90",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  children,
  ...props
}) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" className="text-current" label="" />
      ) : Icon ? (
        <Icon size={iconSize} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
