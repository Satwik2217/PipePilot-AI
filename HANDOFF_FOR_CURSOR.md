# 🚀 PipePilot AI — Complete Handoff Package for Cursor/Windsurf

**Copy this entire message and paste into Cursor with:** "Based on the context below, [your request]"

---

## PROJECT OVERVIEW

**Project:** PipePilot AI - AI Receptionist SaaS for US Plumbing Businesses
**Status:** Modules 1-2 Complete (Website + AI Receptionist Working)
**Tech Stack:** Next.js 15, React 19, TypeScript, TailwindCSS, OpenAI/Cohere API
**Launch Target:** 4 weeks to MVP

---

## CURRENT STATE SUMMARY

### ✅ What's Built (Modules 1-2)

1. **Marketing Website** (Module 1)
   - Landing page with hero section and CTAs
   - About page, Services page, Contact page
   - Responsive design with TailwindCSS
   - Navigation bar and footer
   - Zero JavaScript required

2. **AI Receptionist Widget** (Module 2)
   - Chat widget that floats on all pages
   - Collects customer info: name, phone, address, issue, emergency status
   - Responds with OpenAI (gpt-4o-mini) or Cohere (command-a-plus-05-2026)
   - Auto-fallback: If OpenAI quota exceeded, tries Cohere
   - Local fallback: 6-stage prompt sequence if no API keys
   - Full conversation state management in React
   - Tested and working with live API calls

### ⏸️ What's NOT Built Yet
- Database persistence (leads stored in memory only)
- Plumber dashboard/login
- Email notifications
- Multi-tenant support
- Voice AI
- Billing/Stripe

---

## ARCHITECTURE OVERVIEW

```
Frontend (Next.js App Router)
│
├─ Landing Page + Chat Widget
│  └─ User types message
│
└─ /api/receptionist POST Route
   ├─ OpenAI API (primary)
   │  └─ gpt-4o-mini model
   │
   ├─ Cohere API (fallback if quota exceeded)
   │  └─ command-a-plus-05-2026 model
   │
   └─ Local Prompts (no API key required)
      └─ 6-stage lead collection sequence
```

---

## FILE STRUCTURE

```
app/
├── api/receptionist/route.ts         ← AI logic (dual-provider)
├── layout.tsx                         ← Root wrapper, imports ChatWidget
├── page.tsx                          ← Landing page
├── contact/page.tsx                  ← Contact with inline chat
├── about/page.tsx, services/page.tsx ← Static pages
└── not-found.tsx                     ← 404 handler

components/
├── AIReceptionist.tsx                ← Chat UI + state mgmt
├── ChatWidget.tsx                    ← Floating widget wrapper
├── Nav.tsx                           ← Header navigation
└── Footer.tsx                        ← Footer

styles/
└── globals.css                       ← Global + TailwindCSS

Config Files:
├── package.json                      ← Dependencies
├── tsconfig.json                     ← TypeScript config
├── tailwind.config.ts                ← Theme colors
├── next.config.mjs, postcss.config.js
└── .env.local                        ← API keys (CREATE THIS)
```

---

## KEY CODE SNIPPETS

### API Route: `/api/receptionist`
**Location:** `app/api/receptionist/route.ts`

```typescript
// Request: POST { messages: [{role, content}, ...] }
// Response: { reply: string, source: "openai" | "cohere" | "fallback" }

// Flow:
1. Check AI_PROVIDER env variable
2. Try OpenAI if OPENAI_API_KEY set
   - On quota error (code 429) → Try Cohere
3. Try Cohere if COHERE_API_KEY set
4. Fallback to local prompts (6-stage sequence)
```

### AIReceptionist Component
**Location:** `components/AIReceptionist.tsx`

```typescript
// State:
const [messages, setMessages] = useState<AssistantMessage[]>([])
const [input, setInput] = useState("")
const [isLoading, setIsLoading] = useState(false)

// On send:
1. Add user message to conversation
2. POST to /api/receptionist with all messages
3. Append AI reply to conversation
4. Display both user and AI messages
```

### Chat Widget
**Location:** `components/ChatWidget.tsx`

```typescript
// Floating button at bottom-right
// Closed: Shows button "Need plumbing help? Chat with us."
// Open: Shows full AIReceptionist chat interface
// Toggle with button click
```

---

## ENVIRONMENT VARIABLES

**Create `.env.local` at project root:**

```bash
# Required for AI (choose at least one):
OPENAI_API_KEY=sk-proj-...
COHERE_API_KEY=...

# Optional:
AI_PROVIDER=cohere  # "openai" or "cohere" (defaults to "openai")
```

**If you don't have API keys yet:**
- OpenAI: Get free $5 credits at https://platform.openai.com/account/billing/overview
- Cohere: Free tier at https://dashboard.cohere.com

**If no keys are set:** App still works using local fallback prompts!

---

## HOW TO RUN LOCALLY

```bash
# 1. Install
npm install

# 2. Create .env.local with API keys (or leave empty to use fallback)

# 3. Start dev server
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Click chat widget (bottom-right) and test
```

**Expected:** Chat widget appears, you can type messages, AI responds

---

## HOW THE AI RESPONDS

### If OpenAI API is configured:
1. Sends: `{ messages: [{role, content}, ...], model: "gpt-4o-mini" }`
2. Receives: AI-generated response from gpt-4o-mini
3. Returns: `{ reply: "...", source: "openai" }`

### If OpenAI quota exceeded or no key:
1. Tries Cohere API at `https://api.cohere.com/v2/chat`
2. Sends: `{ messages: [...], model: "command-a-plus-05-2026" }`
3. Receives: AI-generated response
4. Returns: `{ reply: "...", source: "cohere" }`

### If no API keys configured:
1. Uses local 6-stage prompt sequence
2. Stage 1: "What's your name?"
3. Stage 2: "What's your phone?"
4. Stage 3: "What's your address?"
5. Stage 4: "What's the issue?"
6. Stage 5: "Is it urgent?"
7. Returns: `{ reply: "...", source: "fallback" }`

---

## TESTING CHECKLIST

- [ ] Website loads on localhost:3000
- [ ] Landing page shows hero section
- [ ] Chat widget button appears (bottom-right)
- [ ] Click widget → Chat interface opens
- [ ] Type "Hi" → Get AI response
- [ ] Response shows "source: openai/cohere/fallback"
- [ ] Can continue conversation (multi-turn)
- [ ] Close button closes widget
- [ ] Contact page (/contact) shows inline chat
- [ ] Navigation links work (/about, /services)
- [ ] `npm run build` completes with 0 errors

---

## GIT HISTORY

Current commits:
```
1. feat: add AI receptionist widget and OpenAI API
2. feat: add Cohere fallback provider
3. fix: correct Cohere endpoint and response parsing
4. docs: add comprehensive project documentation
```

---

## NEXT STEPS (Module 3)

**To continue building, implement Module 3: Supabase + Dashboard**

Steps:
1. Create Supabase PostgreSQL database (free tier)
2. Create `leads` table (name, phone, address, issue, urgency, status)
3. Update `/api/receptionist/route.ts` to save leads after chat
4. Build Supabase Auth for plumber login
5. Create `/dashboard` page showing all leads
6. Add status management (New, Contacted, Scheduled, Completed, Lost)

**Estimated Time:** 1 week
**Detailed Instructions:** See MODULE_3_GUIDE.md in project

---

## COMMON ISSUES & SOLUTIONS

| Problem | Solution |
|---------|----------|
| ChatWidget doesn't appear | Check app/layout.tsx imports ChatWidget |
| Chat not responding | Verify .env.local has valid API key |
| "Cannot find module" error | Delete .next/ and rebuild |
| TypeScript errors | Run `npm run build` to see all errors |
| API returns error 429 | OpenAI quota exceeded, system tries Cohere |

---

## TECHNOLOGY DETAILS

**Frontend:**
- Next.js 15.2.0 (App Router, not Pages Router)
- React 19.2.6 (functional components + hooks)
- TypeScript 5.5.4 (strict mode)
- TailwindCSS 3.4.4 (utility-first CSS)

**Backend:**
- Next.js API Routes (app/api/*)
- OpenAI API (gpt-4o-mini)
- Cohere API (command-a-plus-05-2026)

**State Management:**
- React.useState (client-side only)
- No Redux, no Zustand (keep it simple)

**Styling:**
- TailwindCSS classes (no CSS-in-JS)
- Custom colors: primary #0067C7, accent #F5A623
- No component library (Shadcn, MUI, etc.)

---

## CODE QUALITY STANDARDS

When adding code, follow these:

1. **TypeScript:** Always type everything (no `any`)
2. **React:** Use functional components + hooks
3. **Styling:** Use TailwindCSS classes
4. **Components:** Keep in `components/` folder
5. **Pages:** Put in `app/[route]/page.tsx`
6. **API:** Put in `app/api/[route]/route.ts`
7. **Naming:** Descriptive names (no `obj`, `data`, `temp`)

---

## BUILD COMMANDS

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Compile for production
npm run start        # Run production build
npm run lint         # Check TypeScript + ESLint
```

---

## DEPLOYMENT

When ready to deploy:

1. Push to GitHub: `git push origin main`
2. Vercel auto-deploys (if connected)
3. Set environment variables in Vercel dashboard
4. Custom domain (optional)

**First deployment:** ~5 minutes
**Subsequent deploys:** ~1 minute

---

## DOCUMENTATION FILES IN PROJECT

Read these for more context:

1. **PROJECT_CONTEXT.md** (20 min read)
   - High-level overview
   - What's been built
   - All file descriptions
   - Environment variables
   - Current status

2. **TECHNICAL_REFERENCE.md** (40 min read)
   - Deep technical details
   - Component structure
   - API route documentation
   - Type definitions
   - Build & deployment
   - Common issues

3. **MODULE_3_GUIDE.md** (30 min read)
   - Step-by-step Module 3 implementation
   - Supabase setup
   - Dashboard building
   - Authentication
   - Email notifications
   - Multi-tenant architecture

4. **CURSOR_QUICK_START.md** (10 min read)
   - Quick reference
   - For Cursor handoff

5. **DOCUMENTATION_INDEX.md** (5 min read)
   - Navigation guide
   - File structure
   - Troubleshooting

6. **README.md** (already in project)
   - Quick start
   - Running locally
   - Testing instructions

---

## SUCCESS CRITERIA FOR MVP

✅ Website loads and is responsive
✅ Chat widget works on all pages
✅ AI responds to customer messages
✅ Conversation history is preserved
✅ Leads are captured (name, phone, address, issue, urgency)
✅ Works with OpenAI OR Cohere OR fallback prompts
✅ Builds cleanly with `npm run build`
✅ Deploys to Vercel successfully
✅ API responses are fast (<2 seconds)

---

## WHAT TO ASK CURSOR

**Copy-paste this template:**

"Based on the PipePilot AI project context above (Modules 1-2 complete with AI receptionist), I need to build Module 3. Here's what I want:

**Module 3 Goal:** Add Supabase database to persist captured leads + build plumber dashboard

**Requirements:**
1. Create Supabase PostgreSQL table for leads (name, phone, address, issue, urgency, status, conversation)
2. Update /api/receptionist to save leads after chat completes
3. Add Supabase Auth for plumber login
4. Build /dashboard page showing all leads in a table
5. Add ability to update lead status (New, Contacted, Scheduled, Completed, Lost)
6. Add middleware to protect /dashboard from non-authenticated users

**Tech Stack:** Keep same (Next.js, React, TypeScript, TailwindCSS)

**Timeline:** Want this done in 1 week

Please build this step-by-step, testing as you go."
```

---

## WHEN YOU'RE STUCK

1. Check **TECHNICAL_REFERENCE.md** for how things work
2. Search the project code for similar patterns
3. Run `npm run build` to see TypeScript errors
4. Check terminal logs for runtime errors
5. Verify `.env.local` has correct API keys

---

## IMPORTANT NOTES

- **Never commit .env.local to Git** (already in .gitignore)
- **Build must pass:** `npm run build` should show 0 errors
- **TypeScript strict mode:** No `any` types, all must be typed
- **API keys are sensitive:** Use secure password managers, never share
- **Test locally first:** Run locally before pushing to production

---

## ABOUT THIS PROJECT

This is a **production-ready MVP** for an AI receptionist SaaS. It's built with modern Next.js 15 patterns, TypeScript for safety, and minimal dependencies.

**Why this tech stack?**
- Next.js: Full-stack framework, best-in-class DX
- React 19: Latest with better performance
- TypeScript: Catches errors before runtime
- TailwindCSS: Fast styling, consistent design
- Minimal deps: Easier to maintain, fewer vulnerabilities

**Production readiness:**
- ✅ Builds cleanly
- ✅ Type-safe codebase
- ✅ Responsive design
- ✅ Error handling
- ✅ Environment configuration
- ✅ Vercel deployment ready
- ✅ Documented architecture

---

## CONTACT & HANDOFF

**When handing to next developer:**
1. Share this entire document
2. Share GitHub repo link
3. Share `.env.local` (securely)
4. Confirm `npm install && npm run dev` works
5. Have them test chat widget
6. Ask: "What module should we build next?"

---

**Last Updated:** Now
**Status:** Ready for Module 3 development
**Estimated MVP Launch:** 3-4 weeks

