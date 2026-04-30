import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';
import { siteConfig } from '@/lib/config';

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(2).max(5000),
});

export async function POST(req: Request) {
  let payload;
  try { payload = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'invalid_input' }, { status: 400 }); }

  const msg = await prisma.contactMessage.create({ data: payload });

  await sendMail({
    to: siteConfig.email,
    replyTo: payload.email,
    subject: `[Kadoa] ${payload.subject ?? 'Message contact'} — ${payload.name}`,
    html: `
      <h2>Nouveau message</h2>
      <p><strong>${payload.name}</strong> · ${payload.email}${payload.phone ? ` · ${payload.phone}` : ''}</p>
      <hr />
      <p style="white-space:pre-wrap">${payload.message.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!))}</p>
    `,
  });

  return NextResponse.json({ ok: true, id: msg.id });
}
