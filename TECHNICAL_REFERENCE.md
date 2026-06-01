# PipePilot AI — Technical Reference

This document provides detailed technical information for developers continuing this project.

---

## Application Architecture

### Frontend Layer
- **Framework:** Next.js 15.2.0 (App Router)
- **UI Framework:** React 19.2.6 with TypeScript
- **Styling:** TailwindCSS 3.4.4
- **Type Safety:** TypeScript 5.5.4 (strict mode)

### Backend Layer
- **API Routes:** Next.js API routes at `app/api/`
- **External APIs:** OpenAI (gpt-4o-mini) and Cohere (command-a-plus-05-2026)
- **Environment Config:** `.env.local` for secrets

### State Management
- **Client State:** React.useState in components
- **Conversation State:** Stored in `AIReceptionist` component (not persisted)
- **Future:** Supabase for persistent lead storage

---

## Component Structure

### AIReceptionist.tsx

**Purpose:** Core chat UI and conversation management

**State Variables:**
```typescript
const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages)
const [input, setInput] = useState("")
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Type Definition:**
```typescript
type AssistantMessage = {
  role: "assistant" | "user"
  content: string
}
```

**Initial Message:**
```
"Hi! I'm the AI Receptionist for RapidFlow Plumbing. How can I help you today? 
If you have a plumbing emergency, please let me know right away."
```

**Key Methods:**

- `handleSend()` — Sends message to `/api/receptionist`, appends response to conversation
- `handleReset()` — Clears all messages and reinitializes with greeting

**Styling:**
- Container: `max-h-96 overflow-auto` (scrollable message area)
- User messages: Blue background (`bg-blue-600`), white text, rounded
- Assistant messages: Gray background (`bg-slate-100`), dark text, rounded
- Input: Text field with send button

### ChatWidget.tsx

**Purpose:** Floating button and container for AIReceptionist

**State:**
```typescript
const [open, setOpen] = useState(false)
```

**Behavior:**
- Closed: Shows button "Need plumbing help? Chat with us."
- Open: Shows full AIReceptionist chat interface with Close button

**Styling:**
- Fixed positioning: `bottom-6 right-6 z-50`
- Chat container: `chat-widget` class with rounded corners and shadow
- Button: Primary color with hover effect

### Nav.tsx

**Purpose:** Navigation bar on all pages

**Content:**
- Company logo/name (PP placeholder)
- Links: Home (/), About (/about), Services (/services), Contact (/contact)
- Styling: Sticky at top, backdrop blur, border-bottom

### Footer.tsx

**Purpose:** Footer section on all pages

**Content:**
- Centered text describing the product
- Styled with slate-600 color

---

## API Route: `/api/receptionist`

**Endpoint:** `POST /api/receptionist`

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hi, I have a leaky pipe" },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "reply": "I'd be happy to help! Can you tell me your full name?",
  "source": "openai" | "cohere" | "fallback"
}
```

**Error Response:**
```json
{
  "error": "Failed to get response from AI service"
}
```

**Flow:**

1. **Check AI Provider:**
   - If `AI_PROVIDER=openai` and `OPENAI_API_KEY` set → Try OpenAI
   - If `AI_PROVIDER=cohere` and `COHERE_API_KEY` set → Try Cohere
   - Otherwise → Use fallback

2. **OpenAI Flow:**
   - Call `https://api.openai.com/v1/chat/completions`
   - Model: `gpt-4o-mini`
   - System prompt: Lead collection guidance
   - Parse response: `choices[0].message.content`
   - On quota error (code 429): Fall back to Cohere if available

3. **Cohere Flow:**
   - Call `https://api.cohere.com/v2/chat`
   - Model: `command-a-plus-05-2026`
   - Parse response: `message.content[0].text` (array of text segments)

4. **Fallback Flow:**
   - Use local prompt sequence based on message count
   - 6-stage lead collection: Greeting → Name → Phone → Address → Issue → Urgency
   - Always available, no API key required

**System Prompt:**
```
You are an AI receptionist for RapidFlow Plumbing, a US-based emergency plumbing service.
Your job is to collect customer information and help them schedule service:

1. Start with a friendly greeting
2. Ask for their full name
3. Ask for their phone number
4. Ask for their address
5. Ask what plumbing issue they're experiencing
6. Ask if it's an emergency (yes/no)

Confirm all information at the end and thank them for choosing RapidFlow Plumbing.
Be friendly, professional, and concise. Keep responses under 100 words.
```

---

## Environment Variables

**File Location:** `.env.local` (create this file at project root)

**Variables:**

| Variable | Type | Required | Default | Description |
|---|---|---|---|---|
| `OPENAI_API_KEY` | string | No | — | OpenAI API key for gpt-4o-mini |
| `COHERE_API_KEY` | string | No | — | Cohere API key for command-a-plus-05-2026 |
| `AI_PROVIDER` | "openai" \| "cohere" | No | "openai" | Which AI to use first |

**Example `.env.local`:**
```bash
AI_PROVIDER=cohere
COHERE_API_KEY=your_cohere_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Database Schema (Future - Supabase)

**Table: `leads`**

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Customer info
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  
  -- Issue details
  issue TEXT,
  urgency BOOLEAN DEFAULT FALSE,
  
  -- Lead management
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'scheduled', 'completed', 'lost'
  
  -- Conversation history (JSON)
  conversation JSONB,
  
  -- Plumber assignment (future)
  assigned_to UUID REFERENCES users(id),
  
  -- Timestamps
  updated_at TIMESTAMP DEFAULT NOW(),
  contacted_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX ON leads(status);
CREATE INDEX ON leads(created_at DESC);
CREATE INDEX ON leads(assigned_to);
```

**Table: `conversations`** (Future)

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  messages JSONB, -- Array of { role, content, timestamp }
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

---

## TypeScript Type Definitions

**Key Types Used:**

```typescript
// AIReceptionist conversation message
type AssistantMessage = {
  role: "assistant" | "user"
  content: string
}

// API request
type ReceptionistRequest = {
  messages: AssistantMessage[]
}

// API response
type ReceptionistResponse = {
  reply: string
  source: "openai" | "cohere" | "fallback"
}

// Lead (future)
type Lead = {
  id: string
  created_at: Date
  name: string
  phone: string
  email: string
  address: string
  issue: string
  urgency: boolean
  status: "new" | "contacted" | "scheduled" | "completed" | "lost"
  conversation: AssistantMessage[]
}
```

---

## Build & Deployment

### Local Development

```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

**Build Output:**
- Next.js compiles all routes
- Optimizes JavaScript and CSS
- Generates `.next` directory

### Deployment to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel automatically deploys on push
# (if connected via GitHub integration)
```

**Environment Variables on Vercel:**
1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add: `OPENAI_API_KEY` or `COHERE_API_KEY`
3. Add: `AI_PROVIDER` (optional)
4. Redeploy

---

## Testing the AI Receptionist

### Manual Testing

1. **Open the chat widget:**
   - Go to `http://localhost:3000`
   - Click the button in bottom-right corner

2. **Test the conversation flow:**
   - Send: "Hi, I have a leaky pipe"
   - Expected: AI asks for name

3. **Test with different providers:**
   - Set `AI_PROVIDER=openai` in `.env.local`
   - Restart dev server
   - Chat should respond via OpenAI

4. **Test fallback mode:**
   - Comment out API keys in `.env.local`
   - Restart dev server
   - Chat should use local prompt sequence

### API Testing with cURL

```bash
curl -X POST http://localhost:3000/api/receptionist \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hi, I have a pipe leak"}
    ]
  }'
```

**Expected Response:**
```json
{
  "reply": "I'd be happy to help! Can you tell me your full name?",
  "source": "openai"
}
```

---

## File Modification Guide

### Adding a New Page

1. Create file at `app/[feature]/page.tsx`
2. Add to `components/Nav.tsx` links if needed
3. Wrap with `<Nav>` and `<Footer>` components
4. Import and use TailwindCSS classes for styling

### Adding a New Component

1. Create file at `components/[Component].tsx`
2. Mark as `"use client"` if it uses hooks
3. Export as default or named export
4. Import and use in pages

### Modifying the AI Receptionist

1. Edit `app/api/receptionist/route.ts` for backend logic
2. Edit `components/AIReceptionist.tsx` for UI changes
3. Edit system prompt in `route.ts` to change AI behavior
4. Restart dev server with `npm run dev`

### Styling Changes

1. Edit `tailwind.config.ts` for color/theme customization
2. Edit `styles/globals.css` for global CSS
3. Edit component JSX for TailwindCSS classes
4. No build step needed—hot reload applies changes

---

## Common Issues & Solutions

### Issue: "Cannot find module './route'"
- **Cause:** Stale `.next` build folder
- **Solution:** `rm -r .next && npm run dev`

### Issue: "OPENAI_API_KEY is not set"
- **Cause:** Missing `.env.local` file
- **Solution:** Create `.env.local` at project root with API key

### Issue: "Receptionist error: Cohere error:"
- **Cause:** Wrong Cohere endpoint or key
- **Solution:** Verify endpoint is `https://api.cohere.com/v2/chat` and key is valid

### Issue: ChatWidget doesn't appear
- **Cause:** ChatWidget not imported in `app/layout.tsx`
- **Solution:** Verify `app/layout.tsx` imports and renders `<ChatWidget />`

---

## Performance Considerations

- **Chat Scrolling:** AIReceptionist uses `max-h-96 overflow-auto` to prevent layout shift
- **API Calls:** Each message sends one request to `/api/receptionist`
- **Fallback System:** Reduces API calls by using local prompts if no keys available
- **Future:** Consider caching common responses or streaming text with OpenAI streaming API

---

## Security Notes

- **API Keys:** Never commit `.env.local` to Git (ignored by `.gitignore`)
- **Rate Limiting:** Add rate limiting middleware if deployed (future)
- **Input Validation:** API route should validate message format (future enhancement)
- **CORS:** Next.js API routes are same-origin by default (safe)

---

## Monitoring & Logging (Future)

- [ ] Add error logging to Sentry
- [ ] Track API call latency and failures
- [ ] Monitor Vercel analytics for page load times
- [ ] Log lead quality metrics (completion rate, etc.)

