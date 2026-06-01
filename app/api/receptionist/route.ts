import { NextResponse } from "next/server";

type ChatMessage = { role: string; content: string };

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
  "Please describe the plumbing issue in a few few words.",
  "Is this an emergency or not? Reply Emergency or Not Emergency.",
  "Thank you. A plumber will contact you shortly."
];

function getFallbackReply(messages: ChatMessage[]) {
  const userCount = messages.filter((message) => message.role === "user").length;
  return fallbackPrompts[Math.min(userCount, fallbackPrompts.length - 1)];
}

function formatOpenAIError(errorBody: any, errorText: string) {
  const message = errorBody?.error?.message ?? errorText;
  const err = new Error(message);
  (err as any).code = errorBody?.error?.code;
  return err;
}

async function createOpenAIReply(messages: ChatMessage[], apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.2,
      max_tokens: 240
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorBody: any = null;
    try {
      errorBody = JSON.parse(errorText);
    } catch {
      errorBody = null;
    }
    throw formatOpenAIError(errorBody, errorText);
  }

  const result = await response.json();
  const reply = result?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error("No response from OpenAI.");
  }
  return reply;
}

async function createCohereReply(messages: ChatMessage[], apiKey: string) {
  const response = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "command-a-plus-05-2026",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.2,
      max_tokens: 240
    })
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Cohere error: ${responseBody}`);
  }

  const result = await response.json();
  const content = result?.message?.content;
  if (!content || !Array.isArray(content)) {
    throw new Error("No response from Cohere.");
  }

  const reply = content
    .filter((item: any) => item?.type === "text" && typeof item.text === "string")
    .map((item: any) => item.text)
    .join("");

  if (!reply.trim()) {
    throw new Error("No response from Cohere.");
  }

  return reply;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const provider = process.env.AI_PROVIDER?.toLowerCase() ?? "openai";
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const cohereApiKey = process.env.COHERE_API_KEY;

  const fallbackResponse = () => NextResponse.json({ reply: getFallbackReply(body.messages), source: "fallback" });

  try {
    let reply: string;

    if (provider === "cohere") {
      if (!cohereApiKey) {
        return fallbackResponse();
      }
      reply = await createCohereReply(body.messages, cohereApiKey);
      return NextResponse.json({ reply, source: "cohere" });
    }

    if (openaiApiKey) {
      try {
        reply = await createOpenAIReply(body.messages, openaiApiKey);
        return NextResponse.json({ reply, source: "openai" });
      } catch (error) {
        if ((error as any).code === "insufficient_quota" && cohereApiKey) {
          const fallbackReply = await createCohereReply(body.messages, cohereApiKey);
          return NextResponse.json({ reply: fallbackReply, source: "cohere" });
        }
        throw error;
      }
    }

    if (cohereApiKey) {
      const cohereReply = await createCohereReply(body.messages, cohereApiKey);
      return NextResponse.json({ reply: cohereReply, source: "cohere" });
    }

    return fallbackResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: `Receptionist error: ${message}` }, { status: 500 });
  }
}
