import { NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';

// Stripe needs the raw request body to verify the signature.
export async function POST(req: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: 'missing_signature' }, { status: 400 });

  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `webhook_verify_failed: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as any;
      const orderId = s.metadata?.orderId;
      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'paid',
            status: 'paid',
            stripePaymentId: s.payment_intent ?? null,
          },
        });
        await sendMail({
          to: order.customerEmail,
          subject: `Paiement reçu — Commande ${order.orderNumber}`,
          html: `<p>Merci ! Votre paiement pour la commande <strong>${order.orderNumber}</strong> a bien été reçu. Nous lançons la production.</p>`,
        });
        await sendMail({
          to: siteConfig.email,
          subject: `[Kadoa] Paiement reçu — ${order.orderNumber}`,
          html: `<p>Paiement Stripe confirmé pour ${order.orderNumber} (${order.totalCents / 100} CHF).</p>`,
        });
      }
      break;
    }
    case 'checkout.session.expired':
    case 'checkout.session.async_payment_failed': {
      const s = event.data.object as any;
      const orderId = s.metadata?.orderId;
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'failed', status: 'cancelled' },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
