'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Loader2, Save } from 'lucide-react';
import { CATEGORIES } from '@/lib/products';

type Initial = {
  id?: string;
  slug: string;
  category: string;
  name: { fr: string; en: string; de: string; pt: string };
  shortDescription: { fr: string; en: string; de: string; pt: string };
  longDescription: { fr: string; en: string; de: string; pt: string };
  priceCents: number;
  stock: number;
  leadTime: string;
  customizable: boolean;
  active: boolean;
  featured: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
};

const empty: Initial = {
  slug: '',
  category: 'baby_shower',
  name: { fr: '', en: '', de: '', pt: '' },
  shortDescription: { fr: '', en: '', de: '', pt: '' },
  longDescription: { fr: '', en: '', de: '', pt: '' },
  priceCents: 0,
  stock: 0,
  leadTime: '5-7 jours ouvrables',
  customizable: true,
  active: true,
  featured: false,
  imageUrl: null,
  imageAlt: null,
};

export function ProductForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [data, setData] = useState<Initial>(initial ?? empty);
  const [tab, setTab] = useState<'fr' | 'en' | 'de' | 'pt'>('fr');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? 'failed');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-ink">{initial ? 'Modifier le produit' : 'Nouveau produit'}</h1>

      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Slug</label>
            <input required value={data.slug} onChange={(e) => setData({ ...data, slug: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Catégorie</label>
            <select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} className="input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Prix (CHF)</label>
            <input required type="number" min="0" step="0.01" value={(data.priceCents / 100).toString()} onChange={(e) => setData({ ...data, priceCents: Math.round(parseFloat(e.target.value || '0') * 100) })} className="input" />
          </div>
          <div>
            <label className="label">Stock</label>
            <input required type="number" min="0" value={data.stock} onChange={(e) => setData({ ...data, stock: parseInt(e.target.value || '0') })} className="input" />
          </div>
          <div>
            <label className="label">Délai</label>
            <input value={data.leadTime} onChange={(e) => setData({ ...data, leadTime: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">URL image (optionnel)</label>
            <input value={data.imageUrl ?? ''} onChange={(e) => setData({ ...data, imageUrl: e.target.value || null })} className="input" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.active} onChange={(e) => setData({ ...data, active: e.target.checked })} /> Actif</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.featured} onChange={(e) => setData({ ...data, featured: e.target.checked })} /> Coup de cœur</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.customizable} onChange={(e) => setData({ ...data, customizable: e.target.checked })} /> Personnalisable</label>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">Contenu multilingue</h2>
        <div className="flex gap-2 border-b border-baby-100">
          {(['fr', 'en', 'de', 'pt'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold ${tab === l ? 'border-baby-400 text-baby-500' : 'border-transparent text-ink-mute hover:text-ink-soft'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Nom ({tab})</label>
            <input value={data.name[tab]} onChange={(e) => setData({ ...data, name: { ...data.name, [tab]: e.target.value } })} className="input" />
          </div>
          <div>
            <label className="label">Description courte ({tab})</label>
            <input value={data.shortDescription[tab]} onChange={(e) => setData({ ...data, shortDescription: { ...data.shortDescription, [tab]: e.target.value } })} className="input" />
          </div>
          <div>
            <label className="label">Description longue ({tab})</label>
            <textarea rows={4} value={data.longDescription[tab]} onChange={(e) => setData({ ...data, longDescription: { ...data.longDescription, [tab]: e.target.value } })} className="input" />
          </div>
        </div>
      </div>

      {err && <p className="text-sm text-rose-600">{err}</p>}
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />…</> : <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
      </button>
    </form>
  );
}
