import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import AIReceptionist from "../../components/AIReceptionist";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Nav />
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200/50">
            <h1 className="text-4xl font-semibold text-slate-950">Contact RapidFlow Plumbing</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700">Chat with our AI receptionist anytime to capture customer details and emergency requests.</p>
            <div className="mt-10 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">What the AI captures</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>• Full Name</li>
                  <li>• Phone Number</li>
                  <li>• Address</li>
                  <li>• Plumbing Issue</li>
                  <li>• Emergency Status</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
                <p className="mt-4 text-slate-600">The AI receptionist guides customers through the conversation, then summarizes the lead for the plumber to review in the next module.</p>
              </div>
            </div>
            <div className="mt-10">
              <Link href="/" className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                Back to Home
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">AI Receptionist Widget</h2>
            <p className="mt-3 text-sm text-slate-600">Open the chat and let the receptionist collect the lead.</p>
            <div className="mt-6">
              <AIReceptionist />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
