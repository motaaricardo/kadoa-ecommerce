'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCart } from '@/stores/cart';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/cn';

export function Header() {
  const t = useTranslations('nav');
  const tSite = useTranslations('site');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);

  const links = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/faq', label: t('faq') },
    { href: '/contact', label: t('contact') },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-baby-100/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-400 font-display text-lg font-bold text-white shadow-soft">
            K
          </span>
          <span className="hidden flex-col leading-tight md:flex">
            <span className="font-cormorant text-base font-semibold text-ink">
              {tSite('name').split('').map((char, idx) =>
                char.toLowerCase() === 'o' ? (
                  <span key={idx} className="text-accent-500">
                    {char}
                  </span>
                ) : (
                  <span key={idx}>{char}</span>
                )
              )}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-ink-mute">{tSite('address')}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium text-ink-soft transition hover:text-accent-500',
                pathname === l.href && 'text-accent-500',
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="rounded-full bg-accent-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-400"
          >
            {t('quote')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openCart}
            aria-label={t('cart')}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-baby-100 text-ink hover:bg-baby-200"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent-400 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-baby-100 text-ink"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-baby-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink-soft hover:bg-baby-50 hover:text-accent-500"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-accent-300 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t('quote')}
            </Link>
          </nav>
        </div>
      )}
    </hea