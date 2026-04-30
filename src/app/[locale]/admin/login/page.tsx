'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const t = useTranslations('admin.login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setErr(t('error'));
      setSubmitting(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <section className="section">
      <div className="mx-auto max-w-md card">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-baby-100 text-baby-500">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('title')}</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">{t('email')}</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">{t('password')}</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </div>
          {err && <p className="text-sm text-rose-600">{err}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />…</> : t('submit')}
          </button>
        </form>
      </div>
    </section>
  );
}
