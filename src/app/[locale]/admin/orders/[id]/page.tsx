import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { OrderStatusForm } from './OrderStatusForm';

export default async function AdminOrderDetail({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();
  const address = JSON.parse(order.shippingAddress);

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink">Commande {order.orderNumber}</h1>
      <p className="text-ink-soft">{formatDate(order.createdAt, locale)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-lg font-semibold">Client</h2>
          <p className="mt-2">{order.customerName}<br />{order.customerEmail}<br />{order.customerPhone}</p>
          <h2 className="mt-6 font-display text-lg font-semibold">Adresse</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {address.address1}<br />
            {address.address2 && <>{address.address2}<br /></>}
            {address.postalCode} {address.city}<br />
            {address.canton}<br />
            {address.country}
          </p>
          {order.notes && <><h2 className="mt-6 font-display text-lg font-semibold">Notes</h2><p className="mt-2 text-sm text-ink-soft">{order.notes}</p></>}
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-semibold">Articles</h2>
          <ul className="mt-3 divide-y divide-baby-100">
            {order.items.map((it) => (
              <li key={it.id} className="py-3">
                <div className="flex justify-between">
                  <span>{it.quantity}× {it.productName}</span>
                  <span className="font-medium">{formatPrice(it.priceCents * it.quantity, locale)}</span>
                </div>
                {it.customization && <div className="mt-1 text-xs italic text-ink-soft">"{it.customization}"</div>}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-baby-100 pt-3 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(order.subtotalCents, locale)}</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>{formatPrice(order.shippingCents, locale)}</span></div>
            <div className="flex justify-between font-display text-lg font-semibold"><span>Total</span><span>{formatPrice(order.totalCents, locale)}</span></div>
          </div>
          <div className="mt-4 text-sm">
            <p>Paiement : <strong>{order.paymentMethod}</strong> · {order.paymentStatus}</p>
          </div>
          <OrderStatusForm orderId={order.id} status={order.status} />
        </div>
      </div>
    </>
  );
}
