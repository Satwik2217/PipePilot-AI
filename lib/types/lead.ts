export type LeadStatus = "new" | "contacted" | "scheduled" | "completed" | "lost";

export type ChatMessage = {
  role: string;
  content: string;
};

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  issue: string | null;
  urgency: boolean;
  status: LeadStatus;
  conversation: ChatMessage[];
  session_id: string | null;
};

export type LeadInsert = {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  issue: string | null;
  urgency: boolean;
  status: LeadStatus;
  conversation: ChatMessage[];
  session_id: string;
};

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "scheduled", "completed", "lost"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  lost: "Lost"
};
