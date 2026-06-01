import { NextResponse } from "next/server";

const systemPrompt = `You are an AI receptionist for a plumbing company.
Your job is to collect customer information.
Required fields:
1. Full Name
2. Phone Number
3. Address
4. Plumbing Issue
5. Emergency Status
Never answer unrelated questions.
Never provide plumbing advice.
Once all fields are collected, summarize the lead and ask the customer to confirm submission.
Be friendly and concise.`;

const fallbackPrompts = [
  "Can I get your full name?",
  "Thanks! What is the best phone number to reach you?",
  "Great. What is the service address?",
  "Please describe the plumbing issue in a few words.",
  "Is this an emergency or not? Reply Emergency or Not Emergency.",
  "Thank you. A plumber will contact you shortly."
];

function getFallbackReply(messages: Array<{ role: string; content: string }>) {
  const userCount = messages.filter((message) => message.role === "user").length;
  return fallbackPrompts[Math.min(userCount, fallbackPrompts.length - 1)];
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: getFallbackReply(body.messages), source: "fallback" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...body.messages],
        temperature: 0.2,
        max_tokens: 240
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `OpenAI error: ${errorText}` }, { status: 502 });
    }

    const result = await response.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "No response from OpenAI." }, { status: 502 });
    }

    return NextResponse.json({ reply, source: "openai" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: `Receptionist error: ${message}` }, { status: 500 });
  }
}
