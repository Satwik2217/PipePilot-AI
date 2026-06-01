"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AIReceptionist from "./AIReceptionist";

const hiddenPrefixes = ["/dashboard", "/auth"];

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="chat-widget rounded-3xl bg-white/95 p-4 shadow-2xl shadow-slate-900/10">
          <div className="flex items-center justify-between gap-3 pb-4">
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
          <AIReceptionist />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 rounded-full bg-primary px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-primary/30 transition hover:bg-blue-600"
        >
          Need plumbing help? Chat with us.
        </button>
      )}
    </div>
  );
}
