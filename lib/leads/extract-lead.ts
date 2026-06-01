import type { ChatMessage, LeadInsert } from "../types/lead";

function getUserMessages(messages: ChatMessage[]): string[] {
  return messages.filter((message) => message.role === "user").map((message) => message.content.trim());
}

function parseUrgency(text: string): boolean {
  const normalized = text.toLowerCase();
  if (normalized.includes("not emergency") || normalized.includes("not urgent")) {
    return false;
  }
  return normalized.includes("emergency") || normalized.includes("urgent");
}

function assistantIndicatesComplete(messages: ChatMessage[]): boolean {
  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  if (!lastAssistant) {
    return false;
  }
  const text = lastAssistant.content.toLowerCase();
  return (
    text.includes("will contact you") ||
    text.includes("plumber will") ||
    text.includes("submitted") ||
    text.includes("we have everything") ||
    text.includes("thank you for confirming")
  );
}

export function isConversationComplete(messages: ChatMessage[]): boolean {
  const userMessages = getUserMessages(messages);
  if (userMessages.length < 5) {
    return false;
  }
  return assistantIndicatesComplete(messages) || userMessages.length >= 5;
}

export function extractLeadFromConversation(messages: ChatMessage[], sessionId: string): LeadInsert | null {
  const userMessages = getUserMessages(messages);
  if (userMessages.length < 5) {
    return null;
  }

  const [name, phone, address, issue, urgencyAnswer] = userMessages;

  if (!name?.trim()) {
    return null;
  }

  return {
    name: name.trim(),
    phone: phone?.trim() || null,
    email: null,
    address: address?.trim() || null,
    issue: issue?.trim() || null,
    urgency: parseUrgency(urgencyAnswer ?? ""),
    status: "new",
    conversation: messages,
    session_id: sessionId
  };
}
