import { extractLeadFromConversation, isConversationComplete } from "./extract-lead";
import { createAdminClient } from "../supabase/admin";
import type { ChatMessage } from "../types/lead";

export type SaveLeadResult = {
  saved: boolean;
  leadId?: string;
  error?: string;
};

export async function trySaveLead(messages: ChatMessage[], sessionId: string): Promise<SaveLeadResult> {
  if (!sessionId || !isConversationComplete(messages)) {
    return { saved: false };
  }

  const lead = extractLeadFromConversation(messages, sessionId);
  if (!lead) {
    return { saved: false };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { saved: false, error: "Supabase is not configured." };
  }

  const { data: existing } = await supabase.from("leads").select("id").eq("session_id", sessionId).maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("leads")
      .update({
        name: lead.name,
        phone: lead.phone,
        address: lead.address,
        issue: lead.issue,
        urgency: lead.urgency,
        conversation: lead.conversation,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id);

    if (error) {
      return { saved: false, error: error.message };
    }

    return { saved: true, leadId: existing.id };
  }

  const { data, error } = await supabase.from("leads").insert(lead).select("id").single();

  if (error) {
    return { saved: false, error: error.message };
  }

  return { saved: true, leadId: data.id };
}
