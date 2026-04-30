'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';

const LABELS: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  de: 'DE',
  pt: 'PT',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-baby-50 px-3 text-xs font-semibold text-ink hover:bg-baby-100"
        aria-label="Language"
      >
        <Globe className="h-3.5 w-3.5" />
        {LABELS[locale]}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[110px] overflow-hidden rounded-2xl border border-baby-100 bg-white shadow-lg">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                router.replace(pathname, { locale: loc });
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-baby-50 ${
                loc === locale ? 'font-semibold text-baby-500' : 'text-ink-soft'
              }`}
            >
              <span className="font-mono text-xs">{LABELS[loc]}</span>
              <span className="text-xs text-ink-mute">
                {loc === 'fr' ? 'Français' : loc === 'en' ? 'English' : loc === 'de' ? 'Deutsch' : 'Português'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
