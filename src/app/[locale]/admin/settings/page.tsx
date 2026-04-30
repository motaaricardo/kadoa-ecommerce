import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { isStripeConfigured } from '@/lib/stripe';
import { isEmailConfigured } from '@/lib/email';
import type { Locale } from '@/i18n/routing';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AdminSettings({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);

  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const checks = [
    { label: 'Stripe (cartes + TWINT)', ok: isStripeConfigured, hint: 'Configurer STRIPE_SECRET_KEY dans .env' },
    { label: 'E-mail (SMTP Infomaniak)', ok: isEmailConfigured, hint: 'Configurer SMTP_HOST/USER/PASSWORD dans .env' },
    { label: 'Base de données', ok: true, hint: '' },
  ];

  return (
    <>
      <h1 className="font-display text-3xl font-bold text-ink">Paramètres</h1>

      <div className="mt-6 card">
        <h2 className="font-display text-xl font-semibold">Intégrations</h2>
        <ul className="mt-4 space-y-2">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3">
              {c.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />}
              <div>
                <div className="font-medium text-ink">{c.label}</div>
                {!c.ok && c.hint && <div className="text-xs text-ink-mute">{c.hint}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 card">
        <h2 className="font-display text-xl font-semibold">Configuration boutique</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Frais de port (CHF)" value={map.shipping_flat_cents ? (Number(map.shipping_flat_cents) / 100).toFixed(2) : '—'} />
          <Row label="Livraison gratuite dès (CHF)" value={map.free_shipping_threshold_cents ? (Number(map.free_shipping_threshold_cents) / 100).toFixed(2) : '—'} />
          <Row label="Stripe carte" value={map.payment_stripe_enabled === 'true' ? 'activé' : 'désactivé'} />
          <Row label="TWINT" value={map.payment_twint_enabled === 'true' ? 'activé' : 'désactivé'} />
          <Row label="PayPal" value={map.payment_paypal_enabled === 'true' ? 'activé' : 'désactivé'} />
          <Row label="Virement bancaire" value={map.payment_bank_transfer_enabled === 'true' ? 'activé' : 'désactivé'} />
          <Row label="Horaires" value={map.business_hours ?? '—'} />
        </dl>
        <p className="mt-4 text-xs text-ink-mute">
          Modifications via Prisma Studio (`npm run db:studio`) ou direct dans le code (`prisma/seed.ts`).
        </p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-baby-100 pb-2">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
