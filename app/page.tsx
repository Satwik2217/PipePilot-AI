import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      <Nav />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              24/7 Plumbing AI Receptionist
            </span>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                RapidFlow Plumbing says hello to customers, captures leads, and routes emergencies instantly.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700">
                A demo website for plumbers that turns visits into qualified calls, stores leads in a Supabase-ready backend, and prepares the product for dashboard and notification workflows.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-blue-600">
                Start a Demo Chat
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50">
                View Services
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Live demo assistant</p>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-slate-900">Need plumbing help?</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">AI:</p>
                    <p className="mt-2 text-sm text-slate-600">Hi there! I’m the AI receptionist. Tell me what’s happening and I’ll get your request to RapidFlow Plumbing.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">Customer:</p>
                    <p className="mt-2 text-sm text-slate-600">My water heater is leaking and I need someone right away.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">This mockup shows the end-to-end experience we will build for lead capture, urgency classification, and plumber notification.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
