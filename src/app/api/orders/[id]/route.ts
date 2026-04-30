import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const Body = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await ctx.params;
  let body;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'invalid_input' }, { status: 400 }); }

  await prisma.order.update({ where: { id }, data: { status: body.status } });
  return NextResponse.json({ ok: true });
}
