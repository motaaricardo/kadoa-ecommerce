'use client';
import { useRouter } from '@/i18n/routing';
import { Trash2 } from 'lucide-react';

export function DeleteProductButton({ id, confirmLabel }: { id: string; confirmLabel: string }) {
  const router = useRouter();
  const handle = async () => {
    if (!confirm(confirmLabel)) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
  };
  return (
    <button
      onClick={handle}
      className="grid h-8 w-8 place-items-center rounded-full bg-baby-50 text-rose-500 hover:bg-rose-50"
      aria-label="delete"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
