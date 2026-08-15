
import { Spinner } from "./ui/Spinner";
import { Skeleton } from "./ui/Skeleton";

/**
 * Reusable loading states.
 * - <Loading />   → full-page skeleton (appears under the NavBar, does not cover it)
 * - <LoadingSpinner size /> → standalone centered spinner
 */
export function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-fade-in px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6" aria-label="Loading content" aria-busy="true">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-72 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </main>
  );
}

const LoadingSpinner = ({ size = "md", className = "" }) => {
  return (
    <div className="flex w-full items-center justify-center py-16">
      <Spinner size={size} className={`text-primary ${className}`} />
    </div>
  );
};

export default LoadingSpinner;
