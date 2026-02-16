import { Card } from "@/components/ui/card";

export function JobCardSkeleton() {
  return (
    <Card className="mx-3 mb-2 p-3">
      <div className="mb-2 flex items-start gap-3">
        <div className="skeleton-shimmer h-11 w-11 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton-shimmer h-3 w-28 rounded" />
          <div className="skeleton-shimmer h-3 w-full rounded" />
          <div className="skeleton-shimmer h-3 w-2/3 rounded" />
        </div>
      </div>
      <div className="flex gap-1">
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        <div className="skeleton-shimmer h-5 w-20 rounded-full" />
      </div>
    </Card>
  );
}
