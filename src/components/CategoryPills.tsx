'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { CATEGORIES } from '@/lib/products';
import { cn } from '@/lib/cn';

export function CategoryPills({ active }: { active?: string }) {
  const t = useTranslations('categories');
  const tProducts = useTranslations('products');
  const pathname = usePathname();

  const isAll = !active && pathname === '/products';
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products"
        className={cn(
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          isAll ? 'border-accent-400 bg-accent-300 text-ink' : 'border-baby-100 bg-white text-ink-soft hover:border-baby-200',
        )}
      >
        {tProducts('filterAll')}
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={`/category/${c}`}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition',
            active === c
              ? 'border-accent-400 bg-accent-300 text-ink'
              : 'border-baby-100 bg-white text-ink-soft hover:border-baby-200',
          )}
        >
          {t(c)}
        </Link>
      ))}
    </div>
  );
}
