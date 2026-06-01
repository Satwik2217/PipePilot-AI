# PipePilot AI — Module 1 & Module 2

This repository contains the first two modules of the PipePilot AI plumbing receptionist demo.

## What is included

- Next.js 15 app router setup
- TailwindCSS styling
- Landing page for a demo plumbing company
- About, Services, Contact pages
- Floating AI chat widget and receptionist UI
- OpenAI API route for AI receptionist responses
- Clean folder structure for future backend, Supabase, and OpenAI integration

## Module 2 — AI Receptionist

Module 2 introduces the AI receptionist flow and connects the contact experience to an API route:

- `components/AIReceptionist.tsx` — chat UI and conversation state
- `components/ChatWidget.tsx` — floating widget opens the receptionist
- `app/api/receptionist/route.ts` — OpenAI-backed route for lead collection prompts
- `app/contact/page.tsx` — inline contact page chat experience

## Install

1. Install dependencies:

```bash
npm install
```

2. Run the app locally:

```bash
npm run dev
```

3. Open http://localhost:3000

## Environment

Create a `.env.local` file at the project root and add:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

If `OPENAI_API_KEY` is missing, the receptionist route falls back to a local prompt sequence, so the demo remains functional without OpenAI credentials.

## Testing Module 2

- Visit `http://localhost:3000/contact`
- Open the receptionist chat widget in the lower-right corner
- Send a message and verify the AI receptionist responds
- Confirm that `/api/receptionist` is reachable when the app is running

## Commit message

When committing this module, use:

```bash
git commit -m "feat: add AI receptionist widget and OpenAI receptionist API route"
```

Future code updates should also include a short descriptive commit message and a matching README update when the project scope changes.

## Next step

The next module will connect leads to Supabase, persist captured leads, and add a plumber dashboard for lead management.
