export function NewJobsBanner({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div className="mx-3 my-2 rounded-lg border border-accent/40 bg-accent/15 px-3 py-2 text-xs text-accent">
      {count} new job{count === 1 ? "" : "s"} since your last visit
    </div>
  );
}
