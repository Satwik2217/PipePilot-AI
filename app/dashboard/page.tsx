import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardNav from "../../components/DashboardNav";
import LeadDashboard from "../../components/LeadDashboard";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/server";
import type { Lead } from "../../lib/types/lead";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-surface">
        <section className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Supabase not configured</h1>
          <p className="mt-3 text-sm text-slate-600">
            Add <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="rounded bg-slate-100 px-1">.env.local</code>, then run the SQL migration in{" "}
            <code className="rounded bg-slate-100 px-1">supabase/migrations/001_leads.sql</code>.
          </p>
          <Link href="/" className="mt-6 text-sm font-semibold text-primary hover:underline">
            ← Back to website
          </Link>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-surface">
        <DashboardNav email={user.email} />
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-950">Lead dashboard</h1>
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load leads: {error.message}. Run the SQL migration in Supabase if you have not already.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <DashboardNav email={user.email} />
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">Lead dashboard</h1>
          <p className="mt-2 text-slate-600">View captured leads, update status, and review full chat conversations.</p>
        </div>
        <LeadDashboard initialLeads={(leads ?? []) as Lead[]} />
      </section>
    </main>
  );
}
