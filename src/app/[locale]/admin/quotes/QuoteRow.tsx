'use client';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  quote: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    eventType: string;
    description: string;
    status: string;
    dateLabel: string;
  };
};

export function QuoteRow({ quote }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const markReplied = async () => {
    setUpdating(true);
    await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quote.id, status: 'replied' }),
    });
    setUpdating(false);
    router.refresh();
  };

  return (
    <div className="card !p-0">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-ink">{quote.name} · <span className="text-ink-soft">{quote.email}</span></div>
          <div className="truncate text-sm text-ink-mute">{quote.eventType} · {quote.dateLabel}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${quote.status === 'new' ? 'bg-accent-300 text-ink' : 'bg-emerald-50 text-emerald-700'}`}>
          {quote.status}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-ink-mute transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="border-t border-baby-100 px-5 py-4 text-sm text-ink-soft">
          <p className="whitespace-pre-wrap">{quote.description}</p>
          {quote.phone && <p className="mt-2">Tél : {quote.phone}</p>}
          <div className="mt-4 flex gap-2">
            <a href={`mailto:${quote.email}`} className="btn-secondary">Répondre par e-mail</a>
            {quote.status === 'new' && (
              <button onClick={markReplied} disabled={updating} className="btn-primary">
                <Check className="mr-2 h-4 w-4" /> Marquer répondu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
