"use client";

import { useMemo, useState } from "react";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "../lib/types/lead";

type LeadDashboardProps = {
  initialLeads: Lead[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function LeadDashboard({ initialLeads }: LeadDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | "urgent" | "normal">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }
      if (urgencyFilter === "urgent" && !lead.urgency) {
        return false;
      }
      if (urgencyFilter === "normal" && lead.urgency) {
        return false;
      }
      return true;
    });
  }, [leads, statusFilter, urgencyFilter]);

  async function updateLeadStatus(leadId: string, status: LeadStatus) {
    setUpdatingId(leadId);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to update lead.");
      }

      setLeads((current) => current.map((lead) => (lead.id === leadId ? (payload.lead as Lead) : lead)));
      setSelectedLead((current) => (current?.id === leadId ? (payload.lead as Lead) : current));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Failed to update lead.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="statusFilter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as LeadStatus | "all")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="urgencyFilter" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Urgency
          </label>
          <select
            id="urgencyFilter"
            value={urgencyFilter}
            onChange={(event) => setUrgencyFilter(event.target.value as "all" | "urgent" | "normal")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="urgent">Emergency only</option>
            <option value="normal">Non-emergency</option>
          </select>
        </div>
        <p className="ml-auto text-sm text-slate-600">
          {filteredLeads.length} of {leads.length} leads
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {filteredLeads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">No leads yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Complete a chat on the website to capture your first lead. Leads appear here after name, phone, address,
            issue, and urgency are collected.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Issue</th>
                  <th className="px-4 py-3 font-semibold">Urgency</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="px-4 py-4 text-slate-700">{lead.phone ?? "—"}</td>
                    <td className="max-w-xs truncate px-4 py-4 text-slate-700">{lead.issue ?? "—"}</td>
                    <td className="px-4 py-4">
                      {lead.urgency ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Emergency
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-sm disabled:opacity-50"
                      >
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {LEAD_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="font-semibold text-primary hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{selectedLead.name}</h2>
                <p className="text-sm text-slate-600">Captured {formatDate(selectedLead.created_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-medium text-slate-900">{selectedLead.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Address</dt>
                <dd className="font-medium text-slate-900">{selectedLead.address ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Issue</dt>
                <dd className="font-medium text-slate-900">{selectedLead.issue ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Urgency</dt>
                <dd className="font-medium text-slate-900">{selectedLead.urgency ? "Emergency" : "Normal"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-slate-900">{LEAD_STATUS_LABELS[selectedLead.status]}</dd>
              </div>
            </dl>

            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Conversation</h3>
            <div className="space-y-3">
              {(selectedLead.conversation ?? []).map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "assistant"
                      ? "rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"
                      : "rounded-2xl bg-primary/10 p-3 text-sm text-slate-900"
                  }
                >
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-500">{message.role}</p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
