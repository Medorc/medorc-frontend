import React from "react";
import { FiCheck, FiX, FiShield } from "react-icons/fi";

export function PasswordHealthCheck({ password = "" }) {
  if (!password) return null;

  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", valid: /[a-z]/.test(password) },
    { label: "Number (0-9)", valid: /[0-9]/.test(password) },
    { label: "Special character (!@#$%^&*)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getMeterConfig = () => {
    if (score <= 2) {
      return { label: "Weak Password", color: "bg-red-500", text: "text-red-600 dark:text-red-400", width: "w-1/4" };
    }
    if (score === 3) {
      return { label: "Fair Strength", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", width: "w-2/4" };
    }
    if (score === 4) {
      return { label: "Strong Password", color: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", width: "w-3/4" };
    }
    return { label: "Healthcare Grade", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", width: "w-full" };
  };

  const meter = getMeterConfig();

  return (
    <div className="mt-3 rounded-xl border border-border bg-surface/60 p-3 text-xs space-y-2 animate-fade-in">
      <div className="flex items-center justify-between font-semibold">
        <span className="flex items-center gap-1.5 text-foreground">
          <FiShield className={meter.text} size={14} /> Password Health Meter
        </span>
        <span className={meter.text}>{meter.label}</span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-surface-hover overflow-hidden">
        <div className={`h-full transition-all duration-300 ${meter.color} ${meter.width}`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {checks.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {item.valid ? (
              <FiCheck className="text-emerald-500 shrink-0" size={13} />
            ) : (
              <FiX className="text-subtle shrink-0" size={13} />
            )}
            <span className={item.valid ? "text-foreground font-medium" : "text-subtle"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
