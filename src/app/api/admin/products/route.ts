import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const Body = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  category: z.enum(['baby_shower', 'corporate', 'wedding', 'baptism', 'birthday']),
  name: z.record(z.string()),         // { fr, en, de, pt }
  shortDescription: z.record(z.string()),
  longDescription: z.record(z.string()),
  priceCents: z.number().int().min(0),
  stock: z.number().int().min(0),
  leadTime: z.string().default('5-7 jours ouvrables'),
  customizable: z.boolean().default(true),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  imageUrl: z.string().url().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'invalid_input' }, { status: 400 }); }

  const data = {
    slug: body.slug,
    category: body.category,
    name: JSON.stringify(body.name),
    shortDescription: JSON.stringify(body.shortDescription),
    longDescription: JSON.stringify(body.longDescription),
    priceCents: body.priceCents,
    stock: body.stock,
    leadTime: body.leadTime,
    customizable: body.customizable,
    active: body.active,
    featured: body.featured,
    imageUrl: body.imageUrl ?? null,
    imageAlt: body.imageAlt ?? null,
  };

  const product = body.id
    ? await prisma.product.update({ where: { id: body.id }, data })
    : await prisma.product.create({ data });

  return NextResponse.json({ id: product.id });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
