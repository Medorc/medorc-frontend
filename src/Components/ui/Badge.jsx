
const tones = {
  primary: "bg-primary-soft text-primary-soft-fg",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-hover text-muted",
  patient: "bg-patient-soft text-patient",
  doctor: "bg-doctor-soft text-doctor",
  hospital: "bg-hospital-soft text-hospital",
  extern: "bg-extern-soft text-extern",
};

export function Badge({ tone = "neutral", className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
