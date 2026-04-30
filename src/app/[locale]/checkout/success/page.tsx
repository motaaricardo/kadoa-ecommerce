import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { CheckCircle2 } from 'lucide-react';

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ o?: string; session_id?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('success');

  const orderNumber = sp.o ?? null;

  return (
    <section className="section">
      <div className="mx-auto max-w-xl card text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
        {orderNumber && (
          <p className="mt-6 inline-block rounded-full bg-baby-50 px-4 py-2 text-sm">
            <span className="text-ink-soft">{t('orderNumber')}: </span>
            <span className="font-mono font-semibold text-ink">{orderNumber}</span>
          </p>
        )}
        <p className="mt-6 text-sm text-ink-soft">{t('next')}</p>
        <Link href="/" className="btn-primary mt-8">{t('back')}</Link>
      </div>
    </section>
  );
}
