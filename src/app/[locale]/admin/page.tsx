import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { ShoppingBag, Wallet, Hourglass, FileText } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const t = await getTranslations('admin.dashboard');
  const tOrders = await getTranslations('admin.orders');

  const [totalOrders, totalRevenue, pendingOrders, newQuotes, recent] = await Promise.all([
    prisma.order.count({ where: { paymentStatus: 'paid' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'paid' }, _sum: { totalCents: true } }),
    prisma.order.count({ where: { status: { in: ['pending', 'paid', 'processing'] } } }),
    prisma.quoteRequest.count({ where: { status: 'new' } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const cards = [
    { label: t('totalOrders'), value: totalOrders, icon: ShoppingBag },
    { label: t('totalRevenue'), value: formatPrice(totalRevenue._sum.totalCents ?? 0, locale), icon: Wallet },
    { label: t('pendingOrders'), value: pendingOrders, icon: Hourglass },
    { label: t('newQuotes'), value: newQuotes, icon: FileText },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink">{t('title')}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-baby-100 text-accent-500">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-mute">{label}</div>
              <div className="font-display text-2xl font-semibold text-ink">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="font-display text-xl font-semibold text-ink">{t('recentOrders')}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink-mute">
              <tr>
                <th className="py-2 text-left">{tOrders('number')}</th>
                <th className="py-2 text-left">{tOrders('date')}</th>
                <th className="py-2 text-left">{tOrders('customer')}</th>
                <th className="py-2 text-right">{tOrders('total')}</th>
                <th className="py-2 text-left">{tOrders('status')}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-baby-100">
                  <td className="py-2 font-mono">{o.orderNumber}</td>
                  <td className="py-2">{formatDate(o.createdAt, locale)}</td>
                  <td className="py-2">{o.customerName}</td>
                  <td className="py-2 text-right">{formatPrice(o.totalCents, locale)}</td>
                  <td className="py-2"><StatusPill status={o.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-ink-mute">—</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-baby-50 text-ink-soft',
    paid: 'bg-emerald-50 text-emerald-700',
    processing: 'bg-amber-50 text-amber-700',
    shipped: 'bg-blue-50 text-blue-700',
    delivered: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-rose-50 text-rose-700',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? 'bg-baby-50'}`}>{status}</span>;
}
