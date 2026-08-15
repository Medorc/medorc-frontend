
import { Input } from "./ui/Field";

function formatDateValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileField({
  label,
  value,
  onChange,
  name,
  disabled,
  type = "text",
  placeholder,
}) {
  if (disabled) {
    return (
      <div>
        <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
        <div className="rounded-xl bg-surface-hover px-3.5 py-2.5 text-sm font-medium text-muted">
          {type === "date" ? formatDateValue(value) : value || "—"}
        </div>
      </div>
    );
  }

  return (
    <Input
      label={label}
      value={value || ""}
      type={type}
      onChange={(e) => onChange(e, name)}
      placeholder={placeholder || `Enter ${label}`}
    />
  );
}
