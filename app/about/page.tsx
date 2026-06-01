import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Nav />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50">
          <h1 className="text-4xl font-semibold text-slate-950">About RapidFlow Plumbing</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            RapidFlow Plumbing is a demo plumbing brand built to show how AI can act as a digital receptionist, collect customer details, and move leads into a workflow that notifies the plumber instantly.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Built for plumbers</h2>
              <p className="mt-3 text-slate-600">Capture every after-hours request, avoid missed calls, and get a unified lead record for each job.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Ready for growth</h2>
              <p className="mt-3 text-slate-600">The site is intentionally simple so we can layer in OpenAI, Supabase, and a dashboard as the next step.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
