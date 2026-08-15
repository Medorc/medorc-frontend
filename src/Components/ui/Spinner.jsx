
export function Spinner({ size = "md", className = "", label = "Loading" }) {
  const px = size === "sm" ? 14 : size === "lg" ? 26 : 18;
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: px, height: px }}
    />
  );
}
