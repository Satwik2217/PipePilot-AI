import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Nav />
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50">
          <h1 className="text-4xl font-semibold text-slate-950">Contact RapidFlow Plumbing</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">This page is a placeholder for the AI chat widget and contact form experience. The AI receptionist will ask for the customer's information and submit the lead.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">What the AI captures</h2>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>• Full Name</li>
                <li>• Phone Number</li>
                <li>• Address</li>
                <li>• Plumbing Issue</li>
                <li>• Emergency Status</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Next step</h2>
              <p className="mt-4 text-slate-600">The next module will wire this page to an OpenAI-powered receptionist and persist leads to Supabase.</p>
            </div>
          </div>
          <div className="mt-10">
            <Link href="/" className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
