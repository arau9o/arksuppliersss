import Stripe from "stripe";

// Lazy singleton — never instantiated at build time, only on first real request.
// This prevents Vercel's build analysis step from throwing due to a missing key.
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}
