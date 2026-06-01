# PipePilot AI — Quick Start for Cursor/Windsurf

**Use this document when asking Cursor to continue development.**

---

## Current State (In 30 Seconds)

✅ **Modules 1-2 Complete:**
- Landing website for RapidFlow Plumbing
- AI receptionist chat widget (OpenAI or Cohere)
- Collects: name, phone, address, issue, emergency status
- Tech stack: Next.js 15, React 19, TypeScript, TailwindCSS

**Code Quality:** 
- Builds cleanly with `npx next build`
- No TypeScript errors
- Both APIs tested and working
- Fallback to local prompts if no API key

**What's NOT Built Yet:**
- Database for lead storage (next priority)
- Dashboard for plumber
- Email notifications
- Multi-tenant support
- Billing

---

## Project Files Overview

```
app/
├── api/receptionist/route.ts     # AI handler (OpenAI/Cohere dual-provider)
├── layout.tsx                     # Root layout with ChatWidget
├── page.tsx                       # Landing page
├── contact/page.tsx               # Chat page inline widget
├── about/page.tsx, services/page.tsx
└── not-found.tsx

components/
├── AIReceptionist.tsx             # Chat UI + state management
├── ChatWidget.tsx                 # Floating widget button
├── Nav.tsx, Footer.tsx            # Layout components

config files:
- tailwind.config.ts, next.config.mjs, tsconfig.json
- package.json, .env.local
```

---

## What to Build Next: Module 3

**Goal:** Add Supabase database + plumber dashboard

**Steps:**

1. **Create Supabase account** (free tier: 2 projects)
2. **Create `leads` table** with fields: name, phone, address, issue, urgency, status, conversation
3. **Update `/api/receptionist/route.ts`** to save leads after chat completes
4. **Add Supabase Auth** for plumber login
5. **Build `/dashboard` page** showing all leads with status management
6. **Add middleware** to protect dashboard from non-authenticated users

**Estimated Time:** 1 week

**Detailed Instructions:** See `MODULE_3_GUIDE.md`

---

## How to Run Locally

```bash
# Clone and install
cd PipePilot-AI
npm install

# Create .env.local (required)
# Add either COHERE_API_KEY or OPENAI_API_KEY
# Or leave empty to use fallback prompts

# Start dev server
npm run dev

# Visit http://localhost:3000
```

---

## File Locations

- **High-level context:** `PROJECT_CONTEXT.md`
- **Technical deep-dive:** `TECHNICAL_REFERENCE.md`
- **Implementation guide:** `MODULE_3_GUIDE.md`
- **Source code:** `app/`, `components/`
- **Styling:** `styles/globals.css`, `tailwind.config.ts`

---

## Key Facts to Know

**Architecture:**
- Next.js App Router (not Pages Router)
- API routes at `app/api/*`
- React hooks for state (no Redux)
- TailwindCSS for styling (no component library)

**AI Integration:**
- Dual-provider: OpenAI + Cohere
- Auto-fallback if OpenAI quota exceeded
- System prompt guides lead collection
- Conversation stored in React state (not yet persisted)

**Type Safety:**
- TypeScript strict mode enabled
- All components typed
- No `any` types (try to avoid)

**Current Limitations:**
- Leads not stored (in memory only)
- No user authentication
- No email notifications
- Single plumber (not multi-tenant)

---

## Git History

```bash
git log --oneline
```

Shows:
1. Module 1: Landing website setup
2. Module 2: AI receptionist with OpenAI
3. Module 2: Added Cohere fallback
4. Bug fix: Cohere API endpoint correction

---

## Environment Variables

**Required for Module 2:**
```bash
# Choose one:
OPENAI_API_KEY=sk-...
COHERE_API_KEY=...

# Optional:
AI_PROVIDER=cohere  # or "openai" (default)
```

**Required for Module 3:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Testing the Current App

**Test landing page:**
- Go to http://localhost:3000
- Should see hero section with CTA buttons

**Test chat widget:**
- Click "Need plumbing help?" button (bottom-right)
- Type a message
- Should get AI response
- Verify it says "source: openai" or "source: cohere" in browser console (if API working)

**Test without API key:**
- Comment out `OPENAI_API_KEY` and `COHERE_API_KEY` in `.env.local`
- Restart dev server
- Chat should still work with local prompts
- Message: "Thanks for contacting us! We'll collect your information..."

---

## Common Next Steps

**If you get stuck, check:**
1. `.env.local` exists and has API keys
2. `npm run dev` is running on localhost:3000
3. No `npm install` errors
4. Browser console for error messages
5. `npm run build` passes (no TypeScript errors)

**If chat not responding:**
- Check `.env.local` for correct API key
- Try `AI_PROVIDER=cohere` if OpenAI key invalid
- Remove API keys entirely to test fallback prompts
- Check terminal logs for error details

---

## Code Quality Standards

Follow these when adding code:

1. **TypeScript:** Always type components and functions
2. **React:** Use functional components + hooks
3. **Styling:** Use TailwindCSS classes (not inline CSS)
4. **Components:** Extract reusable UI into `components/`
5. **Pages:** Keep page logic in `app/[route]/page.tsx`
6. **API:** Keep business logic in `app/api/*` routes
7. **Naming:** Use descriptive names (no `obj`, `data`, `temp`)

---

## Useful Commands

```bash
# Development
npm run dev           # Hot reload on localhost:3000
npm run build         # Build for production
npm run start         # Run production build
npm run lint          # Check TypeScript + ESLint

# Database (when added)
# Migration commands will go here

# Git
git status            # See changes
git add .
git commit -m "..."
git push origin main  # Deploy to Vercel (if connected)
```

---

## AI Provider Details

### OpenAI
- **Model:** gpt-4o-mini
- **Cost:** ~$0.15 per 1M input tokens
- **Endpoint:** https://api.openai.com/v1/chat/completions
- **Latency:** ~1-2 seconds
- **Reliability:** 99.9% uptime

### Cohere
- **Model:** command-a-plus-05-2026
- **Cost:** Free for eval, pay-as-you-go after
- **Endpoint:** https://api.cohere.com/v2/chat
- **Latency:** ~1-2 seconds
- **Reliability:** 99.9% uptime

### Fallback (Local)
- **Cost:** Free
- **Response:** 6-stage predefined prompts
- **Latency:** Instant
- **Reliability:** 100%

---

## Deployment Checklist

When ready to go live on Vercel:

- [ ] `npm run build` passes
- [ ] `.env.local` is NOT committed to Git
- [ ] API keys added to Vercel project settings
- [ ] GitHub repo connected to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured (if needed)
- [ ] HTTPS certificate installed
- [ ] Analytics configured

---

## Support Resources

**When stuck, reference:**
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [OpenAI API](https://platform.openai.com/docs)
- [Cohere API](https://docs.cohere.com)

**Or ask in Cursor:**
"Based on the PROJECT_CONTEXT.md and TECHNICAL_REFERENCE.md, [your specific question]"

---

## Next Person to Work on This

When handing off to someone else:

1. **Share these files:**
   - `PROJECT_CONTEXT.md`
   - `TECHNICAL_REFERENCE.md`
   - `MODULE_3_GUIDE.md`
   - This file: `CURSOR_QUICK_START.md`

2. **Share GitHub repo link**

3. **Share `.env.local`** (use secure password manager)

4. **Ask them to:**
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:3000 and test chat
   ```

5. **Then ask:** "What module should we build next?"

---

## Questions to Ask Before Continuing

Before starting Module 3, clarify with product owner:

1. **Database:** Supabase vs Firebase vs custom backend?
2. **Auth:** Just plumber login, or multi-user teams?
3. **Notifications:** Email first, or SMS/WhatsApp too?
4. **Scaling:** Start single-plumber or multi-tenant from day 1?
5. **Budget:** Any spend limits on hosting/APIs?
6. **Timeline:** When does MVP need to be live?

---

## Success Metrics

Track these to know the project is working:

- ✅ Customers can chat with AI on landing page
- ✅ Each conversation generates a lead
- ✅ Leads are saved to database (Module 3)
- ✅ Plumber receives email for each new lead (Module 4)
- ✅ Plumber can log in and update lead status (Module 3)
- ✅ Multi-plumber companies can sign up (Module 5+)
- ✅ Revenue: 10+ paying customers on Starter plan

---

**Last Updated:** [Date]
**Status:** Modules 1-2 Complete, Ready for Module 3
**Estimated Days to MVP:** 14 days from now
**Estimated Days to v1.0:** 30 days from now

