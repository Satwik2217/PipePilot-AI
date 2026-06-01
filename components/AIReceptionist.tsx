"use client";

import { useState } from "react";

type AssistantMessage = {
  role: "assistant" | "user";
  content: string;
};

const initialMessages: AssistantMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I’m RapidFlow Plumbing’s AI receptionist. I’ll collect a few details so our team can respond quickly. What is your full name?"
  }
];

export default function AIReceptionist() {
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages: AssistantMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/receptionist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });

      const payload = await response.json();
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Unable to get reply from receptionist.");
      }

      setMessages((current) => [...current, { role: "assistant", content: payload.reply }]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, the receptionist is temporarily unavailable. Please try again later or contact us directly."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInput("");
    setError(null);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 w-[340px] sm:w-[420px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">AI Receptionist</p>
          <p className="text-xs text-slate-500">RapidFlow Plumbing</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Reset
        </button>
      </div>

      <div className="mb-4 flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={
              message.role === "assistant"
                ? "rounded-3xl bg-slate-50 p-4 text-sm text-slate-700"
                : "rounded-3xl bg-primary text-white p-4 text-sm"
            }
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={loading}
          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Type your message..."
          aria-label="Chat with AI receptionist"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">The AI receptionist collects name, phone, address, issue, and urgency.</p>
    </div>
  );
}
