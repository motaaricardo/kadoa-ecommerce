'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Send } from 'lucide-react';

export default function QuotePage() {
  const t = useTranslations('quote');
  const tCat = useTranslations('categories');
  const locale = useLocale();

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'baby_shower',
    description: '',
    desiredDate: '',
    estimatedQty: '',
    budget: '',
    contactPref: 'email',
  });

  const change = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          estimatedQty: form.estimatedQty ? Number(form.estimatedQty) : undefined,
          budgetCents: form.budget ? Math.round(Number(form.budget) * 100) : undefined,
          locale,
        }),
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
      setForm({ name: '', email: '', phone: '', eventType: 'baby_shower', description: '', desiredDate: '', estimatedQty: '', budget: '', contactPref: 'email' });
    } catch {
      setErr(t('form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypes = ['baby_shower', 'corporate', 'wedding', 'baptism', 'birthday'] as const;

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
      </header>

      <form onSubmit={submit} className="card mx-auto max-w-3xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">{t('form.name')}</label><input required value={form.name} onChange={change('name')} className="input" /></div>
          <div><label className="label">{t('form.email')}</label><input required type="email" value={form.email} onChange={change('email')} className="input" /></div>
          <div><label className="label">{t('form.phone')}</label><input value={form.phone} onChange={change('phone')} className="input" /></div>
          <div>
            <label className="label">{t('form.eventType')}</label>
            <select value={form.eventType} onChange={change('eventType')} className="input">
              {eventTypes.map((c) => (<option key={c} value={c}>{tCat(c)}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">{t('form.description')}</label>
          <textarea required rows={5} value={form.description} onChange={change('description')} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">{t('form.desiredDate')}</label><input type="date" value={form.desiredDate} onChange={change('desiredDate')} className="input" /></div>
          <div><label className="label">{t('form.estimatedQty')}</label><input type="number" min="1" value={form.estimatedQty} onChange={change('estimatedQty')} className="input" /></div>
          <div><label className="label">{t('form.budget')}</label><input type="number" min="0" step="10" value={form.budget} onChange={change('budget')} className="input" /></div>
        </div>
        <div>
          <label className="label">{t('form.contactPref')}</label>
          <div className="flex gap-2">
            {(['email', 'whatsapp', 'both'] as const).map((p) => (
              <label key={p} className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-medium transition ${form.contactPref === p ? 'border-baby-400 bg-baby-50 text-ink' : 'border-baby-100 text-ink-soft hover:border-baby-200'}`}>
                <input type="radio" name="cp" className="sr-only" checked={form.contactPref === p} onChange={() => setForm((f) => ({ ...f, contactPref: p }))} />
                {p === 'email' ? t('form.byEmail') : p === 'whatsapp' ? t('form.byWhatsapp') : t('form.both')}
              </label>
            ))}
          </div>
        </div>
        {sent && <p className="text-sm text-emerald-600">{t('form.success')}</p>}
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('form.sending')}</> : <><Send className="mr-2 h-4 w-4" />{t('form.submit')}</>}
        </button>
      </form>
    </section>
  );
}
