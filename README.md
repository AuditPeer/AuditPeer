# AuditPeer 🔐

The peer Q&A community for IT and cybersecurity audit professionals.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend + Backend | **Next.js 14** (React, TypeScript) |
| Styling | **Tailwind CSS** |
| Database | **Supabase** (PostgreSQL) |
| Auth | **Supabase Auth** |
| File Storage | **Supabase Storage** |
| Hosting | **Vercel** (free tier) |

---

## 🚀 Getting Started (Local Development)

### Step 1 — Prerequisites

Install these if you don't have them:

- **Node.js 18+** → https://nodejs.org (download LTS version)
- **npm** (comes with Node.js)
- A free **Supabase account** → https://supabase.com
- A free **Vercel account** → https://vercel.com

---

### Step 2 — Set Up Supabase

1. Go to **https://supabase.com** and create a new project
2. Give it a name (e.g. `auditpeer`) and choose a region close to you
3. Wait ~2 minutes for the project to be ready
4. Go to **SQL Editor** (left sidebar) and paste the entire contents of:
   ```
   supabase/migrations/001_schema.sql
   ```
   Click **Run** — this creates all your tables, security rules, and indexes.
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public key** (the long string under "Project API keys")

---

### Step 3 — Configure Environment

1. Rename `.env.local.example` to `.env.local`
2. Fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### Step 4 — Install & Run

Open your terminal in the `auditpeer` folder:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser. You should see AuditPeer running!

---

## 🌐 Deploying to Vercel (Free Hosting)

Vercel hosts Next.js apps for free and deploys automatically when you push code.

### Step 1 — Push to GitHub

1. Create a free account at **https://github.com**
2. Create a new repository called `auditpeer`
3. In your terminal:
```bash
git init
git add .
git commit -m "Initial AuditPeer build"
git remote add origin https://github.com/YOUR_USERNAME/auditpeer.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **https://vercel.com** and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `auditpeer` repository
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL (add after first deploy)
5. Click **Deploy**

Your site will be live at: `https://auditpeer.vercel.app`

### Step 3 — Add a Custom Domain (Optional)

1. Buy `auditpeer.com` (or similar) from Namecheap, GoDaddy, or Cloudflare (~$12/year)
2. In Vercel → your project → **Domains** → add your domain
3. Follow the DNS instructions Vercel gives you
4. Done — your site is live at your custom domain in ~5 minutes

---

## 📁 Project Structure

```
auditpeer/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Main app (all pages/state)
│   └── globals.css         # Global styles + design tokens
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Top navigation bar
│   │   └── Sidebar.tsx     # Left navigation sidebar
│   ├── feed/
│   │   └── QuestionCard.tsx # Individual question card
│   ├── modals/
│   │   ├── ProfileModal.tsx # Signup/edit profile (3-step)
│   │   └── AskModal.tsx    # Post a question
│   └── ui/
│       └── JobsComingSoon.tsx # Jobs placeholder page
├── lib/
│   ├── supabase.ts         # Supabase client setup
│   ├── utils.ts            # Helpers, constants, generators
│   └── seed.ts             # Sample questions for the feed
├── types/
│   └── index.ts            # TypeScript type definitions
├── supabase/
│   └── migrations/
│       └── 001_schema.sql  # Full database schema — run in Supabase
├── .env.local.example      # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔌 Connecting Real Data (Supabase)

Right now the app runs on local seed data. To connect real data:

1. The Supabase client is ready in `lib/supabase.ts`
2. Replace the seed data in `app/page.tsx` with Supabase queries:

```typescript
// Example: fetch questions from Supabase
const { data: questions } = await supabase
  .from('questions')
  .select('*, author:profiles(*)')
  .order('created_at', { ascending: false })
```

3. Enable Auth in Supabase Dashboard → **Authentication → Providers → Email**

---

## 🔧 Easy Things to Change

| What | Where |
|------|-------|
| Site name / logo | `app/layout.tsx` and `components/layout/Header.tsx` |
| Brand colors | `app/globals.css` (CSS variables) and `tailwind.config.js` |
| Seed questions | `lib/seed.ts` |
| Tags list | `lib/utils.ts` → `TAGS` array |
| Industries dropdown | `lib/utils.ts` → `INDUSTRIES` array |
| Certifications | `lib/utils.ts` → `CERTIFICATIONS` array |
| Community Guidelines | `app/page.tsx` → `GUIDELINES` array |

---

## 💰 Costs

| Service | Cost |
|---------|------|
| Vercel (hosting) | **Free** — up to 100GB bandwidth/month |
| Supabase (database + auth) | **Free** — up to 500MB database, 50k monthly active users |
| Domain name | ~$12/year |
| **Total to launch** | **~$12/year** |

---

## 📞 Need Help?

If you get stuck on any step, the most helpful resources are:

- **Next.js docs**: https://nextjs.org/docs
- **Supabase docs**: https://supabase.com/docs
- **Vercel docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
