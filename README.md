# PipePilot AI — Modules 1–3

PipePilot AI is an AI receptionist demo for US plumbing businesses: marketing site, chat lead capture, Supabase persistence, and a plumber dashboard.

## What is included

**Module 1 — Marketing site**

- Next.js 15 App Router, React 19, TypeScript, TailwindCSS
- Landing, About, Services, and Contact pages
- Responsive layout with navigation and footer

**Module 2 — AI receptionist**

- Floating chat widget on all marketing pages
- `components/AIReceptionist.tsx` — chat UI and conversation state
- `components/ChatWidget.tsx` — floating widget wrapper
- `app/api/receptionist/route.ts` — OpenAI (primary), Cohere (fallback), local prompts (no API key)

**Module 3 — Leads & dashboard**

- `supabase/migrations/001_leads.sql` — PostgreSQL schema and RLS policies
- `lib/leads/` — extract lead fields from chat and save to Supabase
- `lib/supabase/` — browser, server, admin, and middleware clients
- `app/auth/login`, `app/auth/register` — plumber sign-in and registration
- `app/dashboard` — lead table, filters, status updates, conversation viewer
- `app/api/leads/[id]/route.ts` — authenticated status updates
- `middleware.ts` — protects `/dashboard` routes

## Install

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` at the project root.

**AI providers** (optional — local fallback works without keys):

```bash
OPENAI_API_KEY=your_openai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
AI_PROVIDER=openai
```

- `OPENAI_API_KEY` — OpenAI (`gpt-4o-mini`)
- `COHERE_API_KEY` — Cohere (`command-a-plus-05-2026`)
- `AI_PROVIDER` — `openai` or `cohere` (default: `openai`)

If OpenAI returns a quota error and Cohere is configured, the API retries with Cohere automatically.

**Supabase** (required for lead persistence and dashboard):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- Public URL and anon key — client auth and dashboard reads (RLS)
- Service role key — server-side lead inserts from `/api/receptionist` only; never expose in the browser

Never commit `.env.local` to Git.

## Supabase setup (Module 3)

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run `supabase/migrations/001_leads.sql`
3. Under **Authentication → Providers**, enable **Email** (disable email confirmation for faster local testing if you prefer)
4. Add the three Supabase variables to `.env.local` (see above)

## Testing

**Module 2 — Chat**

- Visit `/contact` or use the chat widget (bottom-right)
- Send a message and confirm the AI responds
- Without API keys, the 6-stage local prompt sequence still works

**Module 3 — Leads & dashboard**

1. Register at `/auth/register`, then sign in
2. Open `/dashboard`
3. Complete a chat on the homepage: name → phone → address → issue → emergency (or not)
4. Confirm **Lead saved** appears in the widget
5. Refresh the dashboard — lead should appear
6. Change status (New, Contacted, Scheduled, Completed, Lost) and use **View** for the full conversation

## Build & deploy

```bash
npm run build   # production build
npm run start   # run production build locally
npm run lint    # ESLint
```

Deploy to Vercel (or similar) and set the same environment variables in the project dashboard.

## Project structure (key paths)

```
app/
  api/receptionist/route.ts    # AI + lead save
  api/leads/[id]/route.ts      # status updates
  auth/login/                  # plumber login
  auth/register/               # plumber signup
  dashboard/page.tsx           # lead dashboard
components/
  AIReceptionist.tsx
  ChatWidget.tsx
  LeadDashboard.tsx
lib/
  leads/                       # extract + save
  supabase/                    # Supabase clients
  types/lead.ts
supabase/migrations/001_leads.sql
middleware.ts
```

## Documentation

Handoff and implementation guides (optional reading):

- `START_HERE.md`, `PROJECT_CONTEXT.md`, `TECHNICAL_REFERENCE.md`
- `MODULE_3_GUIDE.md` — Module 3 details and Modules 4+ roadmap
- `DOCUMENTATION_INDEX.md` — index of all docs

## Next step

**Module 4** — email notifications when new leads are captured (e.g. Supabase webhook → n8n → SendGrid/Gmail).

## Suggested commit messages

```bash
# Module 3 (code + docs)
git commit -m "feat: add Supabase lead persistence and plumber dashboard"
```

For this release including handoff documentation:

```bash
git commit -m "feat: add Supabase dashboard and Module 3 handoff documentation"
```
