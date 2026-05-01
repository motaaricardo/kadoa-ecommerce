import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { formatPrice, formatDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';

export default async function AdminOrders({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const t = await getTranslations('admin.orders');

  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink">{t('title')}</h1>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-mute">
            <tr>
              <th className="py-2 text-left">{t('number')}</th>
              <th className="py-2 text-left">{t('date')}</th>
              <th className="py-2 text-left">{t('customer')}</th>
              <th className="py-2 text-right">{t('total')}</th>
              <th className="py-2 text-left">{t('payment')}</th>
              <th className="py-2 text-left">{t('status')}</th>
              <th className="py-2 text-right">{t('view')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-baby-100">
                <td className="py-2.5 font-mono">{o.orderNumber}</td>
                <td className="py-2.5">{formatDate(o.createdAt, locale)}</td>
                <td className="py-2.5">
                  <div className="font-medium text-ink">{o.customerName}</div>
                  <div className="text-xs text-ink-mute">{o.customerEmail}</div>
                </td>
                <td className="py-2.5 text-right">{formatPrice(o.totalCents, locale)}</td>
                <td className="py-2.5 text-xs">{o.paymentMethod}</td>
                <td className="py-2.5">
                  <span className="rounded-full bg-baby-50 px-2.5 py-1 text-xs font-medium">{o.status}</span>
                </td>
                <td className="py-2.5 text-right">
                  <Link href={`/admin/orders/${o.id}` as any} className="text-xs font-semibold text-accent-500 hover:text-accent-600">→</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-ink-mute">—</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
