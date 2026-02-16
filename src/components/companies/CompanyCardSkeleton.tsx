export function CompanyCardSkeleton() {
  return (
    <div className="rounded-xl border border-borderColor bg-backgroundCard p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="skeleton-shimmer h-[52px] w-[52px] rounded-full" />
        <div className="space-y-2">
          <div className="skeleton-shimmer h-3 w-28 rounded" />
          <div className="skeleton-shimmer h-3 w-40 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        <div className="skeleton-shimmer h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}
