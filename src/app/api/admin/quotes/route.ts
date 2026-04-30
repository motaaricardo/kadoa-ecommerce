import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const Body = z.object({
  id: z.string(),
  status: z.enum(['new', 'replied', 'closed']),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: 'invalid_input' }, { status: 400 }); }

  await prisma.quoteRequest.update({ where: { id: body.id }, data: { status: body.status } });
  return NextResponse.json({ ok: true });
}
