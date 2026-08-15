# ArkSuppliers

A Robux reseller storefront built with Next.js, Stripe, and Resend — deployable to Vercel in minutes.

---

## Tech Stack
- **Next.js 14** (App Router)
- **Stripe Checkout** — payment processing
- **Resend** — transactional emails to buyer + you
- **Tailwind CSS** — styling
- **Vercel** — hosting

---

## Setup Guide

### 1. Clone and install

```bash
git clone https://github.com/yourusername/arksuppliers
cd arksuppliers
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in each value:

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same as above |
| `STRIPE_WEBHOOK_SECRET` | See step 4 below |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com) |
| `FROM_EMAIL` | A verified domain email in Resend |
| `ROBLOX_USERNAME` | Your Roblox account username |
| `SELLER_EMAIL` | Your personal email for order alerts |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel URL (e.g. `https://arksuppliers.vercel.app`) |

### 3. Customize packages

Edit `lib/packages.ts` to change Robux amounts and prices. Prices are in **cents** (e.g. `499` = $4.99).

### 4. Set up the Stripe webhook

The webhook sends emails automatically when someone pays.

**For local testing:**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhook
# Copy the "webhook signing secret" it prints → paste into STRIPE_WEBHOOK_SECRET
```

**For production (Vercel):**
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret → add as `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 5. Set up Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain (or use `@resend.dev` for testing)
3. Create an API key and add it to `RESEND_API_KEY`

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel and it deploys automatically.

**Add all `.env.local` variables in Vercel:** Project Settings → Environment Variables.

---

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Order Flow

1. Buyer selects a package → clicks "Buy Now"
2. Stripe Checkout page (Stripe handles card + email collection)
3. Payment succeeds → buyer redirected to `/success`
4. Stripe webhook fires → Resend sends two emails:
   - **Buyer**: instructions to add your Roblox account
   - **You**: order alert with buyer's email + Robux amount
5. You add the buyer on Roblox, send the Robux, and email a screenshot receipt
