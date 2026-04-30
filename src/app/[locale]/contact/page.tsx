'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { siteConfig, whatsappUrl } from '@/lib/config';
import { Mail, MapPin, MessageCircle, Clock, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const change = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setErr(t('form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t('form.name')}</label><input required value={form.name} onChange={change('name')} className="input" /></div>
            <div><label className="label">{t('form.email')}</label><input required type="email" value={form.email} onChange={change('email')} className="input" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t('form.phone')}</label><input value={form.phone} onChange={change('phone')} className="input" /></div>
            <div><label className="label">{t('form.subject')}</label><input value={form.subject} onChange={change('subject')} className="input" /></div>
          </div>
          <div><label className="label">{t('form.message')}</label><textarea required rows={6} value={form.message} onChange={change('message')} className="input" /></div>
          {sent && <p className="text-sm text-emerald-600">{t('form.success')}</p>}
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('form.sending')}</> : t('form.submit')}
          </button>
        </form>

        <aside className="space-y-3">
          <a href={`mailto:${siteConfig.email}`} className="card flex items-start gap-3 transition hover:shadow-glow">
            <Mail className="mt-1 h-5 w-5 text-baby-500" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{t('info.email')}</div>
              <div className="font-medium text-ink">{siteConfig.email}</div>
            </div>
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="card flex items-start gap-3 transition hover:shadow-glow">
            <MessageCircle className="mt-1 h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{t('info.phone')}</div>
              <div className="font-medium text-ink">+{siteConfig.whatsappNumber.replace(/(\d{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</div>
            </div>
          </a>
          <div className="card flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-baby-500" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{t('info.address')}</div>
              <div className="font-medium text-ink">{siteConfig.city}, {siteConfig.country}</div>
            </div>
          </div>
          <div className="card flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-baby-500" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{t('info.hours')}</div>
              <div className="font-medium text-ink">Lun-Ven 9h-18h<br />Sam 10h-15h</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
