'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { ProductView } from '@/lib/products';
import type { Locale } from '@/i18n/routing';
import { PlaceholderImage } from './PlaceholderImage';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/stores/cart';
import { ShoppingBag } from 'lucide-react';

export function ProductCard({ product, locale }: { product: ProductView; locale: Locale }) {
  const t = useTranslations('product');
  const tCat = useTranslations('categories');
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <PlaceholderImage
          name={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          imageAlt={product.imageAlt}
          rounded=""
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-baby-300 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
            ★
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-medium uppercase tracking-wider text-baby-500">
          {tCat(product.category)}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-lg leading-tight text-ink hover:text-baby-500">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-soft">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <span className="text-xs text-ink-mute">{t('from')}</span>
            <div className="font-display text-xl font-semibold text-ink">
              {formatPrice(product.priceCents, locale)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              add({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              });
              open();
            }}
            aria-label={t('addToCart')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-baby-300 text-ink transition hover:bg-baby-400 hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
