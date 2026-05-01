'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/stores/cart';
import { formatPrice } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { CreditCard, Smartphone, Wallet, Building2, ShieldCheck, Loader2 } from 'lucide-react';

type PaymentMethod = 'stripe_card' | 'stripe_twint' | 'paypal' | 'bank_transfer';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const subtotal = subtotalCents();
  const shipping = subtotal >= 15000 ? 0 : 900;
  const total = subtotal + shipping;

  const [method, setMethod] = useState<PaymentMethod>('stripe_card');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    canton: '',
    country: 'Suisse',
    notes: '',
  });

  if (items.length === 0) {
    return (
      <section className="section">
        <p className="text-ink-soft">{tCart('empty')}</p>
      </section>
    );
  }

  const change = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            customization: i.customization,
          })),
          customer: form,
          paymentMethod: method,
          locale,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'checkout_failed');
      }
      const data = await res.json();
      if (data.checkoutUrl) {
        // Stripe Checkout (card or TWINT)
        window.location.href = data.checkoutUrl;
        return;
      }
      // Bank transfer / PayPal manual flow → straight to success page
      clear();
      router.push(`/checkout/success?o=${encodeURIComponent(data.orderNumber)}`);
    } catch (e: any) {
      setErr(e.message ?? 'error');
      setSubmitting(false);
    }
  };

  const methods: { value: PaymentMethod; icon: any; label: string; hint?: string }[] = [
    { value: 'stripe_card', icon: CreditCard, label: t('methods.card') },
    { value: 'stripe_twint', icon: Smartphone, label: t('methods.twint'), hint: t('methods.twintHint') },
    { value: 'paypal', icon: Wallet, label: t('methods.paypal') },
    { value: 'bank_transfer', icon: Building2, label: t('methods.bank'), hint: t('methods.bankHint') },
  ];

  return (
    <section className="section">
      <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink">{t('contact')}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">{t('fields.name')}</label><input required value={form.name} onChange={change('name')} className="input" /></div>
              <div><label className="label">{t('fields.email')}</label><input required type="email" value={form.email} onChange={change('email')} className="input" /></div>
              <div><label className="label">{t('fields.phone')}</label><input value={form.phone} onChange={change('phone')} className="input" /></div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink">{t('shipping')}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">{t('fields.address1')}</label><input required value={form.address1} onChange={change('address1')} className="input" /></div>
              <div className="sm:col-span-2"><label className="label">{t('fields.address2')}</label><input value={form.address2} onChange={change('address2')} className="input" /></div>
              <div><label className="label">{t('fields.postalCode')}</label><input required value={form.postalCode} onChange={change('postalCode')} className="input" /></div>
              <div><label className="label">{t('fields.city')}</label><input required value={form.city} onChange={change('city')} className="input" /></div>
              <div><label className="label">{t('fields.canton')}</label><input value={form.canton} onChange={change('canton')} className="input" /></div>
              <div><label className="label">{t('fields.country')}</label><input value={form.country} onChange={change('country')} className="input" /></div>
              <div className="sm:col-span-2"><label className="label">{t('fields.notes')}</label><textarea rows={2} value={form.notes} onChange={change('notes')} className="input" /></div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold text-ink">{t('payment')}</h2>
            <div className="mt-5 grid gap-3">
              {methods.map(({ value, icon: Icon, label, hint }) => (
                <label key={value} className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${method === value ? 'border-accent-400 bg-baby-50' : 'border-baby-100 hover:border-baby-200'}`}>
                  <input type="radio" name="method" className="sr-only" checked={method === value} onChange={() => setMethod(value)} />
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${method === value ? 'bg-accent-300 text-ink' : 'bg-baby-50 text-ink-soft'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-ink">{label}</div>
                    {hint && <div className="text-sm text-ink-soft">{hint}</div>}
                  </div>
                  <span className={`mt-1 grid h-5 w-5 place-items-center rounded-full border ${method === value ? 'border-accent-400 bg-accent-400' : 'border-baby-200 bg-white'}`}>
                    {method === value && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-ink-mute">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> {t('secure')}
            </p>
          </div>
        </div>

        <aside className="card h-fit space-y-4 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold text-ink">{t('orderSummary')}</h2>
          <ul className="divide-y divide-baby-100">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-ink-soft">{i.quantity}× {i.name}</span>
                <span className="font-medium text-ink">{formatPrice(i.priceCents * i.quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-baby-100 pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{tCart('subtotal')}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{tCart('shipping')}</span>
              <span>{shipping === 0 ? tCart('shippingFree') : formatPrice(shipping, locale)}</span>
            </div>
            <div className="flex justify-between pt-2 font-display text-xl font-semibold text-ink">
              <span>{tCart('total')}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>
          </div>
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('processing')}</> : t('placeOrder')}
          </button>
        </aside>
      </form>
    </section>
  );
}
