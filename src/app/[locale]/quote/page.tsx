'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Send, Upload, X } from 'lucide-react';

export default function QuotePage() {
  const t = useTranslations('quote');
  const tCat = useTranslations('categories');
  const locale = useLocale();

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...form,
        estimatedQty: form.estimatedQty ? Number(form.estimatedQty) : undefined,
        budgetCents: form.budget ? Math.round(Number(form.budget) * 100) : undefined,
        locale,
      }));
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
      setForm({ name: '', email: '', phone: '', eventType: 'baby_shower', description: '', desiredDate: '', estimatedQty: '', budget: '', contactPref: 'email' });
      setFiles([]);
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
        <div>
          <label className="label">Fotos do projeto (opcional)</label>
          <div className="rounded-2xl border-2 border-dashed border-baby-200 bg-baby-50/30 p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="block cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-ink-soft mb-2" />
              <p className="text-sm font-medium text-ink">Clica aqui ou arrasta fotos</p>
              <p className="text-xs text-ink-mute">PNG, JPG ou GIF (máx 5MB cada)</p>
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-baby-50 px-3 py-2">
                  <span className="text-sm text-ink">{file.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="text-ink-soft hover:text-rose-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
              <label key={p} className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-medium transition ${form.contactPref === p ? 'border-accent-400 bg-baby-50 text-ink' : 'border-baby-100 text-ink-soft hover:border-baby-200'}`}>
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
