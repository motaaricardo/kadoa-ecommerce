import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { generateOrderNumber } from '@/lib/format';
import { pickLocale } from '@/lib/products';
import { siteConfig } from '@/lib/config';
import { sendMail } from '@/lib/email';

const Body = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1).max(99),
    customization: z.string().max(500).optional(),
  })).min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address1: z.string().min(1),
    address2: z.string().optional(),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    canton: z.string().optional(),
    country: z.string().min(1),
    notes: z.string().optional(),
  }),
  paymentMethod: z.enum(['stripe_card', 'stripe_twint', 'paypal', 'bank_transfer']),
  locale: z.enum(['fr', 'en', 'de', 'pt']).default('fr'),
});

export async function POST(req: Request) {
  let payload;
  try {
    payload = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  // Look up products from DB to get authoritative pricing.
  const ids = payload.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, active: true } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems = payload.items.map((i) => {
    const p = byId.get(i.productId);
    if (!p) throw new Error(`Unknown product ${i.productId}`);
    return {
      product: p,
      quantity: i.quantity,
      customization: i.customization,
    };
  });

  const subtotalCents = lineItems.reduce((s, li) => s + li.product.priceCents * li.quantity, 0);
  const shippingCents = subtotalCents >= 15000 ? 0 : 900;
  const totalCents = subtotalCents + shippingCents;

  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: payload.paymentMethod === 'bank_transfer' ? 'pending' : 'pending',
      paymentMethod: payload.paymentMethod,
      paymentStatus: 'pending',
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      customerPhone: payload.customer.phone,
      shippingAddress: JSON.stringify(payload.customer),
      subtotalCents,
      shippingCents,
      totalCents,
      currency: 'CHF',
      notes: payload.customer.notes,
      locale: payload.locale,
      items: {
        create: lineItems.map((li) => ({
          productId: li.product.id,
          productName: pickLocale(li.product.name, payload.locale),
          quantity: li.quantity,
          priceCents: li.product.priceCents,
          customization: li.customization,
        })),
      },
    },
  });

  // Bank transfer or PayPal: skip Stripe, send email with payment instructions.
  if (payload.paymentMethod === 'bank_transfer' || payload.paymentMethod === 'paypal') {
    await sendMail({
      to: payload.customer.email,
      subject: `Confirmation de commande ${orderNumber} - Kadoa`,
      html: orderEmailHtml({ orderNumber, totalCents, paymentMethod: payload.paymentMethod }),
    });
    await sendMail({
      to: siteConfig.email,
      subject: `[Kadoa] Nouvelle commande ${orderNumber}`,
      html: adminOrderEmailHtml({ orderNumber, customer: payload.customer, totalCents, paymentMethod: payload.paymentMethod }),
    });
    return NextResponse.json({ orderNumber, orderId: order.id });
  }

  // Stripe (card or TWINT)
  if (!isStripeConfigured) {
    return NextResponse.json({
      error: 'stripe_not_configured',
      hint: 'Set STRIPE_SECRET_KEY in .env.local to enable card / TWINT.',
    }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: payload.paymentMethod === 'stripe_twint' ? ['twint'] : ['card'],
    line_items: [
      ...lineItems.map((li) => ({
        quantity: li.quantity,
        price_data: {
          currency: 'chf',
          unit_amount: li.product.priceCents,
          product_data: {
            name: pickLocale(li.product.name, payload.locale),
            metadata: { productId: li.product.id, customization: li.customization ?? '' },
          },
        },
      })),
      ...(shippingCents > 0
        ? [{
            quantity: 1,
            price_data: {
              currency: 'chf' as const,
              unit_amount: shippingCents,
              product_data: { name: 'Frais de port' },
            },
          }]
        : []),
    ],
    customer_email: payload.customer.email,
    metadata: { orderId: order.id, orderNumber },
    success_url: `${siteConfig.url}/${payload.locale}/checkout/success?o=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/${payload.locale}/checkout`,
    locale: payload.locale === 'pt' ? 'pt' : (payload.locale as any),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ checkoutUrl: session.url, orderNumber });
}

function chf(cents: number): string {
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(cents / 100);
}

function orderEmailHtml(args: { orderNumber: string; totalCents: number; paymentMethod: string }): string {
  const bankBlock = args.paymentMethod === 'bank_transfer'
    ? `<p style="margin:16px 0 0">Pour finaliser, merci d'effectuer un virement bancaire :</p>
       <p style="margin:8px 0 0;font-family:monospace">
         Bénéficiaire : Kadoa Sourires & Souvenirs<br/>
         IBAN : CH00 0000 0000 0000 0000 0<br/>
         Référence : ${args.orderNumber}
       </p>`
    : '';
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;color:#2C2C2C">
    <h1 style="font-family:Georgia,serif;color:#E674AC">Merci pour votre commande !</h1>
    <p>Votre commande <strong>${args.orderNumber}</strong> a bien été enregistrée.</p>
    <p>Total : <strong>${chf(args.totalCents)}</strong></p>
    ${bankBlock}
    <p style="margin-top:24px;color:#5C5C5C">Une question ? Répondez simplement à cet e-mail.</p>
    <p style="color:#8A8A8A;font-size:12px">Kadoa Sourires & Souvenirs · Lausanne</p>
  </div>`;
}

function adminOrderEmailHtml(args: { orderNumber: string; customer: any; totalCents: number; paymentMethod: string }): string {
  return `<div style="font-family:system-ui,sans-serif;color:#2C2C2C">
    <h2>Nouvelle commande ${args.orderNumber}</h2>
    <p><strong>${args.customer.name}</strong> · ${args.customer.email} · ${args.customer.phone ?? '-'}</p>
    <p>${args.customer.address1}, ${args.customer.postalCode} ${args.customer.city}, ${args.customer.country}</p>
    <p>Total : <strong>${chf(args.totalCents)}</strong> · Paiement : ${args.paymentMethod}</p>
  </div>`;
}
