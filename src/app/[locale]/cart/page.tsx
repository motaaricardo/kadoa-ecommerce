'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/stores/cart';
import { formatPrice } from '@/lib/format';
import { whatsappUrl } from '@/lib/config';
import { Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale() as Locale;
  const { items, remove, updateQty, subtotalCents } = useCart();
  const subtotal = subtotalCents();
  const empty = items.length === 0;

  const buildWhatsAppMessage = () => {
    const lines = items.map((i) => `• ${i.quantity}× ${i.name} — ${formatPrice(i.priceCents * i.quantity, locale)}`);
    return ['Bonjour Kadoa, je souhaite passer commande :', '', ...lines, '', `Total : ${formatPrice(subtotal, locale)}`].join('\n');
  };

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
      </header>

      {empty ? (
        <div className="card flex flex-col items-center text-center">
          <p className="font-display text-xl text-ink">{t('empty')}</p>
          <p className="mt-1 text-ink-soft">{t('emptyHint')}</p>
          <Link href="/products" className="btn-primary mt-6">{t('continueShopping')}</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.productId} className="card flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Link href={`/products/${i.slug}`} className="font-display text-lg text-ink hover:text-baby-500">
                    {i.name}
                  </Link>
                  <p className="text-sm text-ink-mute">{formatPrice(i.priceCents, locale)}</p>
                  {i.customization && (
                    <p className="mt-1 text-xs italic text-ink-soft">"{i.customization}"</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="inline-flex items-center gap-1 rounded-full bg-baby-50 p-1">
                    <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white" aria-label="-">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold">{i.quantity}</span>
                    <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white" aria-label="+">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-display text-lg font-semibold text-ink">
                    {formatPrice(i.priceCents * i.quantity, locale)}
                  </span>
                  <button onClick={() => remove(i.productId)} className="text-ink-mute hover:text-baby-500" aria-label={t('remove')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card h-fit space-y-4">
            <h2 className="font-display text-xl font-semibold text-ink">{t('subtotal')}</h2>
            <div className="flex justify-between text-sm text-ink-soft">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-soft">
              <span>{t('shipping')}</span>
              <span>{subtotal >= 15000 ? t('shippingFree') : formatPrice(900, locale)}</span>
            </div>
            <div className="border-t border-baby-100 pt-4">
              <div className="flex justify-between font-display text-xl font-semibold text-ink">
                <span>{t('total')}</span>
                <span>{formatPrice(subtotal + (subtotal >= 15000 ? 0 : 900), locale)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full">
              {t('checkout')}
            </Link>
            <a
              href={whatsappUrl(buildWhatsAppMessage())}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
              {t('whatsappCheckout')}
            </a>
          </aside>
        </div>
      )}
    </section>
  );
}
