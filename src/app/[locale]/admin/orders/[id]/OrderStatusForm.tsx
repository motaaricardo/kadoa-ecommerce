'use client';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Save } from 'lucide-react';

export function OrderStatusForm({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    setSaving(false);
    router.refresh();
  };
  return (
    <form onSubmit={submit} className="mt-4 flex items-center gap-2">
      <select value={s} onChange={(e) => setS(e.target.value)} className="input">
        {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
      <button disabled={saving} className="btn-primary"><Save className="mr-2 h-4 w-4" />{saving ? '…' : 'Mettre à jour'}</button>
    </form>
  );
}
