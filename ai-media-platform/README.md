# Draw Odyssey

A full-featured AI media generation platform with 30+ models, 20+ tools, LoRA training, AI agents, community gallery, API platform, and a built-in video editor.

**Tech Stack:** Next.js 14 + Supabase + Stripe + Fal.ai + OpenReel Video

## Features

- **AI Image Generation** — Generate images using FLUX, Stable Diffusion 3.5 via Fal.ai
- **AI Video Generation** — Create video clips using Kling, Minimax, Wan models via Fal.ai
- **Media Library** — Browse, search, and manage all generated assets
- **Video Editor** — Multi-track timeline editor (OpenReel Video integration)
- **Credit System** — Stripe-powered credit purchases with automatic refunds on failures
- **Authentication** — Email/password auth via Supabase

## Quick Setup (15 minutes)

### 1. Create Your Accounts

| Service | URL | What You Need |
|---------|-----|---------------|
| GitHub | github.com | Account + repository |
| Vercel | vercel.com | Sign up with GitHub |
| Supabase | supabase.com | Project URL + API keys |
| Stripe | stripe.com | Secret key + Publishable key |
| Fal.ai | fal.ai | API key |
| Cloudflare | cloudflare.com | R2 bucket + access keys |

### 2. Clone & Install

```bash
git clone https://github.com/YOUR-USERNAME/draw-odyssey.git
cd draw-odyssey
npm install
```

### 3. Set Up Database

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy the entire contents of `supabase-setup.sql`
3. Paste and click **Run**

This creates all tables, row-level security policies, and auto-creates profiles with 20 free credits for new signups.

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API keys from each service.

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Deploy to Vercel

1. Push to GitHub: `git add . && git commit -m "Initial setup" && git push`
2. Go to **Vercel** → Import your repository
3. Add all environment variables from `.env.local` to Vercel project settings
4. Deploy!

### 7. Set Up Stripe Webhook

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/credits/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── auth/              # Login & signup pages
│   ├── dashboard/         # User dashboard
│   ├── generate/          # AI generation interface
│   ├── library/           # Media library browser
│   ├── editor/            # Video editor (OpenReel)
│   ├── pricing/           # Credit purchase page
│   └── api/               # Backend API routes
│       ├── auth/          # Auth callback
│       ├── credits/       # Balance, checkout, webhook
│       ├── generate/      # Image & video generation
│       └── media/         # Media library CRUD
├── components/            # React components
│   └── layout/            # App shell, sidebar
├── lib/                   # Utilities & config
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe config + packages
│   ├── fal.ts            # Fal.ai client + models
│   ├── r2.ts             # Cloudflare R2 storage
│   └── store.ts          # Zustand state management
├── types/                 # TypeScript types
└── styles/                # Global CSS
```

## Credit Costs

| Action | Credits |
|--------|---------|
| Standard image | 1 |
| HD image | 3 |
| 5s video clip | 10 |
| 10s video clip | 20 |
| 15s video clip | 25 |
| Video export | 5 |

## Adding OpenReel Video Editor

The editor page (`/editor`) currently shows a placeholder UI. To integrate the full OpenReel editor:

1. Clone OpenReel: `git clone https://github.com/Augani/openreel-video.git`
2. Study the `packages/core` and `apps/web/src/components/editor` directories
3. Extract the editor components into your `src/components/editor/` folder
4. The editor is React + TypeScript + Zustand — same stack as this project

## License

MIT
