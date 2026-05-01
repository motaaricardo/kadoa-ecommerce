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
  let files: { name: string; data: string; type: string }[] = [];

  try {
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const dataStr = formData.get('data') as string;
      payload = Body.parse(JSON.parse(dataStr));

      // Process files
      const fileEntries = formData.getAll('files') as File[];
      for (const file of fileEntries) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        files.push({
          name: file.name,
          data: base64,
          type: file.type,
        });
      }
    } else {
      payload = Body.parse(await req.json());
    }
  } catch {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

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
  const photosHtml = files.length > 0
    ? `
      <hr />
      <h3>Photos jointes (${files.length})</h3>
      <div>
        ${files.map((f) => `<p><img src="data:${f.type};base64,${f.data}" style="max-width:300px;margin:10px 0;" alt="${escapeHtml(f.name)}" /></p>`).join('')}
      </div>
    `
    : '';

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
      ${photosHtml}
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
