import type { Locale } from '@/i18n/routing';

export function formatPrice(cents: number, locale: Locale = 'fr'): string {
  const map: Record<Locale, string> = {
    fr: 'fr-CH',
    en: 'en-CH',
    de: 'de-CH',
    pt: 'pt-PT',
  };
  return new Intl.NumberFormat(map[locale], {
    style: 'currency',
    currency: 'CHF',
    currencyDisplay: 'code',
  }).format(cents / 100);
}

export function formatDate(date: Date | string, locale: Locale = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const map: Record<Locale, string> = {
    fr: 'fr-CH',
    en: 'en-CH',
    de: 'de-CH',
    pt: 'pt-PT',
  };
  return new Intl.DateTimeFormat(map[locale], {
    dateStyle: 'medium',
  }).format(d);
}

export function generateOrderNumber(): string {
  const yy = new Date().getFullYear().toString().slice(-2);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KDA-${yy}-${rand}`;
}
