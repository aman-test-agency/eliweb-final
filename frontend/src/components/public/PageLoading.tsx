import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading() {
  return (
    <div className="section-shell space-y-6 py-32">
      <Skeleton className="mx-auto h-12 w-2/3 max-w-lg" />
      <Skeleton className="mx-auto h-6 w-1/2 max-w-md" />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    </div>
  );
}
