'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/stores/cart';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/format';
import { whatsappUrl, siteConfig } from '@/lib/config';
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';

export function CartDrawer() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'fr' | 'en' | 'de' | 'pt';
  const { isOpen, close, items, remove, updateQty, subtotalCents, count } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const subtotal = subtotalCents();

  const buildWhatsAppMessage = () => {
    const lines = items.map((i) => `• ${i.quantity}× ${i.name} — ${formatPrice(i.priceCents * i.quantity, locale)}`);
    return [
      'Bonjour Kadoa, je souhaite passer commande :',
      '',
      ...lines,
      '',
      `Total : ${formatPrice(subtotal, locale)}`,
    ].join('\n');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={close}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-baby-100 px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink">{t('title')}</h2>
          <button onClick={close} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-baby-50 hover:bg-baby-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="font-display text-lg text-ink">{t('empty')}</div>
              <p className="mt-1 text-sm text-ink-soft">{t('emptyHint')}</p>
              <Link href="/products" onClick={close} className="mt-6 rounded-full bg-accent-300 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-accent-400 hover:text-white">
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-3 rounded-2xl border border-baby-100 bg-cream p-3">
                  <Link href={`/products/${i.slug}`} onClick={close} className="block flex-1 truncate">
                    <div className="truncate font-medium text-ink">{i.name}</div>
                    <div className="text-sm text-ink-mute">{formatPrice(i.priceCents, locale)}</div>
                  </Link>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
                      <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-baby-50" aria-label="-">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{i.quantity}</span>
                      <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-baby-50" aria-label="+">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => remove(i.productId)} className="text-xs text-ink-mute hover:text-accent-500" aria-label={t('remove')}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-baby-100 bg-baby-50/50 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-ink-soft">{t('subtotal')} ({count()})</span>
              <span className="font-display text-xl font-semibold text-ink">{formatPrice(subtotal, locale)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="block w-full rounded-full bg-accent-400 px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-accent-500"
            >
              {t('checkout')}
            </Link>
            <a
              href={whatsappUrl(buildWhatsAppMessage())}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-baby-200 px-6 py-3 text-sm font-semibold text-ink-soft hover:bg-white"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              {t('whatsappCheckout')}
            </a>
            <p className="mt-3 text-center text-[11px] text-ink-mute">
              {siteConfig.email}
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
