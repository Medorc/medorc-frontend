
export function Skeleton({ className = "" }) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-xl bg-surface-hover ${className}`} />
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
