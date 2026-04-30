import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { QuoteRow } from './QuoteRow';

export default async function AdminQuotes({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const t = await getTranslations('admin.quotes');
  const tCat = await getTranslations('categories');

  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink">{t('title')}</h1>
      <div className="mt-6 space-y-3">
        {quotes.length === 0 && <p className="text-ink-mute">—</p>}
        {quotes.map((q) => (
          <QuoteRow
            key={q.id}
            quote={{
              id: q.id,
              name: q.name,
              email: q.email,
              phone: q.phone,
              eventType: tCat(q.eventType as any) ?? q.eventType,
              description: q.description,
              status: q.status,
              dateLabel: formatDate(q.createdAt, locale),
            }}
          />
        ))}
      </div>
    </>
  );
}
