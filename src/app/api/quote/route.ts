import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';
import { siteConfig } from '@/lib/config';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  eventType: z.string().min(1).max(60),
  description: z.string().min(5).max(4000),
  desiredDate: z.string().optional(),
  estimatedQty: z.number().int().min(1).optional(),
  budgetCents: z.number().int().min(0).optional(),
  contactPref: z.enum(['email', 'whatsapp', 'both']).default('email'),
  locale: z.string().max(5).default('fr'),
});

export async function POST(req: Request) {
  let payload;
  try { payload = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'invalid_input' }, { status: 400 }); }

  const quote = await prisma.quoteRequest.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      eventType: payload.eventType,
      description: payload.description,
      desiredDate: payload.desiredDate ? new Date(payload.desiredDate) : null,
      estimatedQty: payload.estimatedQty,
      budgetCents: payload.budgetCents,
      contactPref: payload.contactPref,
      locale: payload.locale,
    },
  });

  // Notify the merchant
  await sendMail({
    to: siteConfig.email,
    replyTo: payload.email,
    subject: `[Kadoa] Nouveau devis — ${payload.eventType} — ${payload.name}`,
    html: `
      <h2>Nouvelle demande de devis</h2>
      <p><strong>${payload.name}</strong> · ${payload.email}${payload.phone ? ` · ${payload.phone}` : ''}</p>
      <p>Type : <strong>${payload.eventType}</strong></p>
      ${payload.desiredDate ? `<p>Date souhaitée : ${payload.desiredDate}</p>` : ''}
      ${payload.estimatedQty ? `<p>Quantité : ${payload.estimatedQty}</p>` : ''}
      ${payload.budgetCents ? `<p>Budget : ${payload.budgetCents / 100} CHF</p>` : ''}
      <p>Préférence de contact : ${payload.contactPref}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(payload.description)}</p>
    `,
  });

  // Confirm to the customer
  await sendMail({
    to: payload.email,
    subject: 'Votre demande de devis Kadoa est bien reçue',
    html: `
      <div style="font-family:system-ui,sans-serif;color:#2C2C2C">
        <h2 style="font-family:Georgia,serif;color:#E674AC">Merci ${escapeHtml(payload.name)} !</h2>
        <p>Nous avons bien reçu votre demande et reviendrons vers vous dans les 24 heures.</p>
        <p style="color:#8A8A8A">Kadoa Sourires & Souvenirs · Lausanne</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, id: quote.id });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
