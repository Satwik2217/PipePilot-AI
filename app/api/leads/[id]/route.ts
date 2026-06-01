import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { LEAD_STATUSES, type LeadStatus } from "../../../../lib/types/lead";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  if (!body || typeof body.status !== "string") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = body.status as LeadStatus;
  if (!LEAD_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}
