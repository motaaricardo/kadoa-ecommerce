import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

// Lazy export so the app still builds without a Stripe key during local dev /
// while the merchant account is being set up.
export const stripe = key
  ? new Stripe(key, { apiVersion: '2024-12-18.acacia' as any })
  : (null as unknown as Stripe);

export const isStripeConfigured = Boolean(key);
