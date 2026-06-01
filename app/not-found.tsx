import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50">
        <h1 className="text-4xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for doesn’t exist. Try returning to the homepage.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
