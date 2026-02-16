import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-borderColor bg-backgroundCard p-6 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-textTertiary">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-textSecondary">The page you requested does not exist or has been moved.</p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accentHover"
        >
          Back to Jobs
        </Link>
      </div>
    </main>
  );
}
