
export function Card({ className = "", as, ...props }) {
  const Tag = as || "div";
  return (
    <Tag
      className={`rounded-2xl border border-border bg-surface shadow-card ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ title, description, icon: Icon, action, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg">
            <Icon size={20} aria-hidden="true" />
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = "", ...props }) {
  return <div className={`px-5 py-5 ${className}`} {...props} />;
}
