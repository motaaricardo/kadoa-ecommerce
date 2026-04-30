'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCart } from '@/stores/cart';
import type { ProductView } from '@/lib/products';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

export function ProductDetailActions({ product }: { product: ProductView }) {
  const t = useTranslations('product');
  const router = useRouter();
  const add = useCart((s) => s.add);
  const setCustomization = useCart((s) => s.setCustomization);
  const open = useCart((s) => s.open);
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState('');

  const handleAdd = (goCheckout: boolean) => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
      },
      qty,
    );
    if (custom.trim()) setCustomization(product.id, custom.trim());
    if (goCheckout) router.push('/checkout');
    else open();
  };

  return (
    <div className="mt-8 space-y-4">
      {product.customizable && (
        <div>
          <label className="label" htmlFor="custom">{t('personalisation')}</label>
          <textarea
            id="custom"
            rows={3}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={t('personalisationPlaceholder')}
            className="input"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-baby-50 p-1">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm hover:bg-baby-100" aria-label="-">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm hover:bg-baby-100" aria-label="+">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => handleAdd(false)} className="btn-primary">
          <ShoppingBag className="mr-2 h-4 w-4" />
          {t('addToCart')}
        </button>
        <button onClick={() => handleAdd(true)} className="btn-secondary">
          {t('buyNow')}
        </button>
      </div>
    </div>
  );
}
