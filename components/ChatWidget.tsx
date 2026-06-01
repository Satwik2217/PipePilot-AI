"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="chat-widget rounded-3xl bg-white/95 p-4 shadow-2xl shadow-slate-900/10">
        {open ? (
          <div className="chat-card rounded-3xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">AI Receptionist</p>
                <p className="text-xs text-slate-500">RapidFlow Plumbing</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Need plumbing help?</p>
                <p>Click below to chat with our AI receptionist and generate a new lead.</p>
              </div>
              <button
                type="button"
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Open Chat
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 rounded-full bg-primary px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-primary/30 transition hover:bg-blue-600"
          >
            <span>Need plumbing help? Chat with us.</span>
          </button>
        )}
      </div>
    </div>
  );
}
