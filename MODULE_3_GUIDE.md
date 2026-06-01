# PipePilot AI — Module 3 & Beyond: Implementation Guide

This guide provides step-by-step instructions for continuing development from Module 2.

---

## Module 3: Supabase Lead Storage & Dashboard

**Objective:** Persist captured leads to a database and build a plumber dashboard to view and manage them.

**Timeline:** ~1-2 weeks for experienced developer

### 3.1: Supabase Setup

**Step 1: Create Supabase Project**
1. Go to https://supabase.com
2. Create new project
3. Note the project URL and anon API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

**Step 2: Create Database Schema**

Run these SQL queries in Supabase dashboard → SQL Editor:

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  issue TEXT,
  urgency BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new',
  conversation JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX leads_status_idx ON leads(status);
CREATE INDEX leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX leads_urgency_idx ON leads(urgency);

-- Enable RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

**Step 3: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### 3.2: Update Receptionist API to Persist Leads

**File:** `app/api/receptionist/route.ts`

**New Requirement:** After collecting all lead info, save to Supabase before returning final message

**Changes:**
1. Import Supabase client
2. Create function `extractLeadFromConversation()` to parse messages and extract: name, phone, address, issue, urgency
3. After getting AI response, check if conversation is complete (6 messages ≈ all fields collected)
4. Save to `leads` table with conversation as JSON

**Example Addition:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function extractAndSaveLead(messages: Array<{role: string, content: string}>) {
  // Parse conversation to extract lead info
  const lead = {
    name: extractField(messages, 'name'),
    phone: extractField(messages, 'phone'),
    address: extractField(messages, 'address'),
    issue: extractField(messages, 'issue'),
    urgency: extractField(messages, 'urgent') === 'yes',
    conversation: messages,
    status: 'new'
  }
  
  // Save to Supabase
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
  
  return { data, error }
}
```

### 3.3: Create Supabase Auth (Plumber Login)

**Step 1: Enable Auth in Supabase**
1. Go to Supabase dashboard → Authentication
2. Enable Email/Password provider

**Step 2: Create Users Table**
```sql
-- Create users table (separate from auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**Step 3: Install NextAuth.js (or use Supabase Auth directly)**

**Option A: Simple Approach (Supabase Auth + cookies)**
```bash
npm install @supabase/auth-helpers-nextjs
```

**Option B: More Flexible (NextAuth.js v5)**
```bash
npm install next-auth@beta @auth/supabase-adapter
```

For this project, recommend **Option A** (simpler, built for Next.js).

### 3.4: Create Login & Register Pages

**File:** `app/auth/login/page.tsx`

```typescript
"use client"
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Plumber Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

**File:** `app/auth/register/page.tsx`

Create similar page with sign-up logic using `supabase.auth.signUp()`

### 3.5: Create Dashboard Page

**File:** `app/dashboard/page.tsx`

**Requirements:**
- Show list of all leads in a table
- Columns: Name, Phone, Issue, Urgency, Status, Created At, Actions
- Status dropdown (New, Contacted, Scheduled, Completed, Lost)
- Filter by status and urgency
- View full conversation on click
- Edit lead details

**Rough Structure:**
```typescript
"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient(...)

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      setLeads(data || [])
      setLoading(false)
    }
    
    fetchLeads()
  }, [])

  return (
    <main className="min-h-screen bg-surface">
      <Nav />
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Lead Dashboard</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Issue</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4">{lead.phone}</td>
                  <td className="p-4">{lead.issue}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="px-3 py-1 border rounded"
                    >
                      <option>new</option>
                      <option>contacted</option>
                      <option>scheduled</option>
                      <option>completed</option>
                      <option>lost</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button className="text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
```

### 3.6: Add Middleware to Protect Dashboard

**File:** `middleware.ts` (new at project root)

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if accessing /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('sb-auth-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## Module 4: Email Notifications (n8n)

**Objective:** Send email to plumber when new lead is captured

**Timeline:** ~1 week

### 4.1: Setup n8n

1. Go to https://n8n.cloud (or self-host)
2. Create account and new workflow
3. Add trigger: **Webhook** (to receive POST from Supabase)

### 4.2: Configure Supabase → n8n Webhook

In Supabase dashboard:
1. Go to Webhooks (under Database)
2. Create new webhook on `leads` table
3. Event: Insert
4. HTTP method: POST
5. URL: Your n8n webhook URL

### 4.3: Build n8n Workflow

**Flow:**
```
Supabase Webhook
  ↓
  Extract lead data
  ↓
  Gmail/SendGrid node
  ↓
  Send email to plumber
```

**Email Template:**
```
Subject: New Lead - [Customer Name]

Customer Name: {{name}}
Phone: {{phone}}
Address: {{address}}
Issue: {{issue}}
Emergency: {{urgency ? 'YES' : 'No'}}
Received: {{created_at}}

Dashboard: https://your-domain.com/dashboard
```

---

## Module 5: Multi-Tenant Architecture (v2)

**Objective:** Support multiple plumbers with separate logins, leads, and AI prompts

**Timeline:** ~3-4 weeks

### 5.1: Update Database Schema

Add `company_id` foreign key to leads:

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE leads ADD COLUMN company_id UUID REFERENCES companies(id);
ALTER TABLE users ADD COLUMN company_id UUID REFERENCES companies(id);
```

### 5.2: Update Auth Flow

- Sign up creates: auth user + company + users record
- Each plumber belongs to exactly one company
- Leads are scoped to company

### 5.3: Add Row-Level Security (RLS)

```sql
-- Users can only see their own company's leads
CREATE POLICY leads_company_isolation ON leads
  FOR SELECT USING (
    company_id = (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );
```

---

## Module 6: Voice AI (v2)

**Objective:** Handle incoming phone calls with AI

**Timeline:** ~2 weeks

**Recommended Provider:** Vapi.ai (easy integration)

### 6.1: Setup Vapi

1. Go to https://vapi.ai
2. Create account and API key
3. Set up phone number (or use existing Twilio)

### 6.2: Create Voice Receptionist

- System prompt: Same as text receptionist
- Auto-trigger on incoming call
- Transfer to human if needed
- Capture call recording

---

## Module 7: Billing (v2)

**Objective:** Stripe-based subscription tiers

**Timeline:** ~2 weeks

### 7.1: Pricing Tiers

- **Starter:** $49/month (50 leads/month, basic dashboard)
- **Professional:** $99/month (500 leads/month, email notifications, voice AI)
- **Premium:** $199/month (unlimited, multi-user, advanced analytics)

### 7.2: Stripe Integration

- Use Stripe + Supabase for subscription management
- Add pricing page at `/pricing`
- Add subscription management at `/dashboard/billing`

---

## Priority Order for Development

**Phase 1 (MVP - Next 2 weeks):**
1. ✅ Module 1: Website
2. ✅ Module 2: AI Receptionist
3. → **Module 3: Supabase + Dashboard** ← START HERE

**Phase 2 (Core Features - Weeks 3-4):**
4. → **Module 4: Email Notifications**
5. → Test end-to-end: Chat → Lead saved → Email sent → Dashboard shows lead

**Phase 3 (Scaling - Weeks 5-8):**
6. → **Module 5: Multi-tenant Architecture**
7. → **Module 6: Voice AI**

**Phase 4 (Monetization - Week 9+):**
8. → **Module 7: Billing & Stripe**

---

## Testing Checklist for Each Module

### Module 3 Checklist
- [ ] Leads table created in Supabase
- [ ] New chat messages save leads to database
- [ ] Login page works
- [ ] Dashboard loads and shows leads
- [ ] Status dropdown updates database
- [ ] Conversation is viewable in dashboard
- [ ] Filters work (by status, urgency, date)

### Module 4 Checklist
- [ ] n8n workflow receives webhook from Supabase
- [ ] Email is sent to plumber
- [ ] Email includes all lead info
- [ ] Email only sent for new leads (not updates)

### Module 5 Checklist
- [ ] Multiple plumbers can sign up
- [ ] Each sees only their own leads
- [ ] Admin can create sub-users for same company
- [ ] Leads are scoped correctly by RLS policies

---

## Key Commands to Remember

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Run tests (when added)
npm test

# Deploy to Vercel
git push origin main
```

---

## Environment Variables by Module

**Module 1-2 (Complete):**
```bash
AI_PROVIDER=cohere
OPENAI_API_KEY=sk-...
COHERE_API_KEY=...
```

**Module 3 (Add):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Module 4 (Add):**
```bash
N8N_WEBHOOK_URL=https://...n8n.cloud/webhook/...
SENDGRID_API_KEY=...  # or Gmail config
```

**Module 5+ (Add):**
```bash
STRIPE_API_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Documentation & Handoff

When handing off to another developer:

1. **Copy these files to send:**
   - `PROJECT_CONTEXT.md` — High-level overview
   - `TECHNICAL_REFERENCE.md` — Deep technical details
   - This file — Implementation roadmap
   - `README.md` — Quick start

2. **Share credentials (securely):**
   - `.env.local` file (use password manager, never in Git)
   - GitHub repo access
   - Supabase project link (if created)
   - Any API key documentation

3. **Review:**
   - Run `npm install && npm run dev`
   - Verify app runs on localhost:3000
   - Test chat widget and confirm API responses
   - Ask: "What module should I build next?"

---

## Questions Before Starting

Ask the product owner:

1. Should Module 3 dashboard be public or require login?
2. How many plumbers will we start with (single vs multi-tenant)?
3. Do we want voice calls in MVP or later?
4. What's the priority: feature completeness or customer feedback loop?
5. Budget for Supabase, n8n, Stripe, etc?

