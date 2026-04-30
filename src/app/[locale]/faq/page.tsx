'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function FaqPage() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<number | null>(0);
  const items = t.raw('items') as Array<{ q: string; a: string }>;

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
      </header>

      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-lg font-medium text-ink">{item.q}</span>
                <ChevronDown className={cn('h-5 w-5 text-baby-500 transition-transform', isOpen && 'rotate-180')} />
              </button>
              <div className={cn('grid overflow-hidden transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-ink-soft">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
