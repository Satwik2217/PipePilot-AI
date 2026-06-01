import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50">
            <h1 className="text-4xl font-semibold text-slate-950">What RapidFlow Plumbing offers</h1>
            <p className="text-lg leading-8 text-slate-700">A demo service stack for local plumbing businesses: website lead capture, AI receptionist flows, emergency classification, and plumber notifications.</p>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-semibold text-slate-900">AI Receptionist</h2>
              <p className="mt-3 text-slate-600">Guides visitors through a conversation, asks for contact details, and confirms urgency.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Lead Capture</h2>
              <p className="mt-3 text-slate-600">Collects name, phone, address, issue, and emergency status to prepare a structured lead record.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Dashboard Ready</h2>
              <p className="mt-3 text-slate-600">The next module will add authentication, lead management, and a plumber dashboard.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
