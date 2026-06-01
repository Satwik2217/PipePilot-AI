# PipePilot AI — Complete Project Context

**Project Name:** PipePilot AI
**Status:** Modules 1 & 2 Complete
**Tech Stack:** Next.js 15, React 19, TypeScript, TailwindCSS, OpenAI/Cohere API
**Deployment Target:** Vercel

---

## Project Overview

PipePilot AI is a SaaS product demo for US plumbing businesses that provides an AI receptionist for lead capture and management. The product collects customer details via an AI chat widget, stores leads, and notifies plumbers of new requests.

**Vision:** Build a production-ready AI receptionist that turns website visitors and after-hours callers into qualified leads.

---

## Architecture

```
Customer
   │
   ▼
Frontend Website Widget
   │
   ▼
AI Receptionist
(OpenAI / Cohere API)
   │
   ▼
Lead Extraction Engine
   │
   ▼
Supabase Database (Future)
   │
   ├── Dashboard (Future)
   │
   ├── Email Notification (Future)
   │
   └── SMS Notification (Future)
```

---

## What Has Been Built

### Module 1: Marketing Website

**Status:** ✅ Complete

A Next.js frontend that showcases a demo plumbing company (RapidFlow Plumbing) with:

- Landing page with hero section and call-to-action
- About, Services, Contact pages
- Navigation bar with company branding
- Footer with project info
- Responsive TailwindCSS styling
- Floating AI chat widget entry point

**Files:**
- `app/page.tsx` — Landing page
- `app/about/page.tsx` — About page
- `app/services/page.tsx` — Services page
- `app/contact/page.tsx` — Contact page with inline receptionist
- `app/layout.tsx` — Root layout with metadata and ChatWidget
- `app/not-found.tsx` — 404 error page
- `components/Nav.tsx` — Navigation bar
- `components/Footer.tsx` — Footer

### Module 2: AI Receptionist & Chat Widget

**Status:** ✅ Complete

A working AI receptionist that:

- Collects customer information (name, phone, address, issue, urgency)
- Responds to user messages via OpenAI or Cohere API
- Falls back to local prompt sequence if no API key is configured
- Persists conversation state in the chat UI
- Shows in a floating widget on all pages and inline on the contact page

**Files:**
- `components/AIReceptionist.tsx` — Chat UI component with state management
- `components/ChatWidget.tsx` — Floating widget that opens the receptionist
- `app/api/receptionist/route.ts` — NextAPI route that routes requests to OpenAI or Cohere

**AI Provider Support:**
- OpenAI (`gpt-4o-mini` model)
- Cohere (`command-a-plus-05-2026` model)
- Fallback to local prompts if no API is configured
- Automatic retry: if OpenAI quota is exceeded, falls back to Cohere

---

## Project Structure

```
PipePilot-AI/
├── app/
│   ├── api/
│   │   └── receptionist/
│   │       └── route.ts                 # AI receptionist endpoint
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── layout.tsx                       # Root layout with ChatWidget
│   ├── page.tsx                         # Landing page
│   ├── not-found.tsx                    # 404 page
│
├── components/
│   ├── AIReceptionist.tsx               # Chat UI component
│   ├── ChatWidget.tsx                   # Floating widget wrapper
│   ├── Nav.tsx                          # Navigation bar
│   ├── Footer.tsx                       # Footer
│
├── styles/
│   └── globals.css                      # Global TailwindCSS + custom styles
│
├── public/                              # (Empty, for future assets)
│
├── .env.local                           # Local environment variables
├── .gitignore
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
├── package-lock.json
├── README.md
├── next-env.d.ts
└── .git/                                # Git repository

```

---

## Key Files & Their Purpose

### Configuration Files

**`package.json`**
- Dependencies: `next@15.2.0`, `react@19.2.6`, `react-dom@19.2.6`
- DevDependencies: TypeScript, TailwindCSS, ESLint, Autoprefixer
- Scripts: `dev`, `build`, `start`, `lint`

**`tsconfig.json`**
- TypeScript strict mode enabled
- Next.js plugin configured
- App router support

**`tailwind.config.ts`**
- Custom color theme: primary (#0067C7), accent (#F5A623), surface (#F8FAFC)
- Responsive design patterns

**`postcss.config.js`**
- TailwindCSS and Autoprefixer integration

**`.env.local`** (User-created)
```bash
AI_PROVIDER=cohere  # or "openai"
COHERE_API_KEY=your_cohere_key
OPENAI_API_KEY=your_openai_key  # (optional fallback)
```

### Core Components

**`components/AIReceptionist.tsx`**
- State: messages, input, loading, error
- Sends requests to `/api/receptionist`
- Displays conversation with AI
- Reset button to clear chat history
- Handles form submission and error states

**`components/ChatWidget.tsx`**
- Toggles between closed and open states
- Renders `AIReceptionist` when open
- Floats at bottom-right of page (fixed positioning)

**`app/api/receptionist/route.ts`**
- POST endpoint that accepts: `{ messages: Array<{ role, content }> }`
- Tries OpenAI first (if `OPENAI_API_KEY` is set)
- Falls back to Cohere if OpenAI quota exceeded
- Returns: `{ reply: string, source: "openai" | "cohere" | "fallback" }`
- Falls back to local prompts if no API key

**`app/layout.tsx`**
- Root layout wraps all pages
- Imports global CSS
- Renders `<ChatWidget />` on all pages
- Sets metadata for SEO

**`app/page.tsx`**
- Landing page with hero section
- Call-to-action buttons linking to /contact and /services
- Responsive grid layout with demo mockup

**`app/contact/page.tsx`**
- Contact page with two-column layout
- Left: Information about what AI collects
- Right: Inline `AIReceptionist` component
- Shows the full conversation flow

---

## How to Use This Project

### Setup

```bash
cd C:\Users\satwi\OneDrive\Documents\PipePilot-AI

npm install

# Create .env.local and add your API key
# COHERE_API_KEY=your_key_here
# or
# OPENAI_API_KEY=your_key_here

npm run dev
```

### Run

```bash
npm run dev
# Opens on http://localhost:3000
```

### Build

```bash
npm run build
npm start
```

### Test the AI Receptionist

1. Open `http://localhost:3000`
2. Click the chat widget button in the bottom-right
3. Or navigate to `http://localhost:3000/contact` to see the inline chat
4. Send a message and the AI receptionist will respond

---

## Environment Variables

Create `.env.local` at the project root:

```bash
# Choose one or both AI providers
AI_PROVIDER=cohere              # "openai" or "cohere"
OPENAI_API_KEY=sk-...           # Optional
COHERE_API_KEY=...              # Optional

# If both are set:
# - OpenAI is tried first
# - Cohere is used as automatic fallback if OpenAI hits quota limits
# - If neither is configured, local prompt sequence is used
```

---

## Current Status

✅ **Module 1:** Marketing website with landing page, navigation, and static content pages
✅ **Module 2:** AI receptionist chat widget with OpenAI/Cohere integration

---

## Next Steps (Module 3)

The following features are planned but NOT YET BUILT:

### Module 3: Supabase Lead Storage & Dashboard

- [ ] Create Supabase PostgreSQL database with `leads` and `conversations` tables
- [ ] Lead schema: `id, created_at, name, phone, email, address, issue, urgency, status, conversation_history`
- [ ] Add API route to persist leads after AI conversation completes
- [ ] Supabase authentication for plumber login
- [ ] Admin dashboard page at `/dashboard` with:
  - [ ] Lead list table
  - [ ] Lead detail view with full conversation
  - [ ] Status update buttons (New, Contacted, Scheduled, Completed, Lost)
  - [ ] Filters by urgency, date, status

### Module 4: Email Notifications & n8n Workflow

- [ ] Setup n8n workflow to listen for new leads
- [ ] Send email to plumber with lead details
- [ ] Future: SMS and WhatsApp notifications

### Module 5+: Voice AI, Multi-tenant SaaS, Billing

- [ ] Integrate Vapi or Retell AI for voice calls
- [ ] Multi-tenant architecture with separate companies and users
- [ ] Stripe billing with tiered plans
- [ ] Advanced analytics with PostHog

---

## Important Notes for Cursor/Windsurf

When asking Cursor to proceed further, provide this context:

**Current State:**
- Next.js 15 app with app router
- React 19 components with TypeScript
- TailwindCSS for styling
- AI receptionist collects: name, phone, address, issue, urgency
- Supports OpenAI and Cohere APIs with fallback
- All files compile successfully with `npx next build`

**Key Decisions Made:**
1. Single-plumber MVP first (NOT multi-tenant SaaS yet)
2. Cohere as free-tier alternative to OpenAI
3. Supabase for database (not yet integrated)
4. Next.js API routes for backend logic
5. TailwindCSS for styling (no additional UI library)

**Build Command:** `npx next build` → should show all routes compiling successfully

**Dev Command:** `npm run dev` → runs on `http://localhost:3000`

---

## Commits Made So Far

```bash
git commit -m "feat: add AI receptionist widget and OpenAI receptionist API route"
git commit -m "feat: add Cohere AI provider fallback for receptionist and app not-found page"
git commit -m "fix: correct Cohere chat API endpoint and response parsing"
```

---

## Production Deployment

When ready to deploy to Vercel:

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` or `COHERE_API_KEY`
   - `AI_PROVIDER` (optional, defaults to openai)
4. Deploy

---

## Questions for Next Steps

When passing to Cursor, consider these questions:

1. Should we add Supabase lead storage next, or test the current AI flow more thoroughly first?
2. Should we implement multi-tenant support early, or wait until we have one paying customer?
3. Do we want to add voice AI (Vapi/Retell) in Module 4, or focus on text-based chat first?
4. Should we use n8n for email notifications, or implement email logic directly in the API?

