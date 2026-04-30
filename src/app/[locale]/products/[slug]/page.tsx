import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { getProductBySlug, listProducts } from '@/lib/products';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { ProductDetailActions } from './ProductDetailActions';
import { formatPrice } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { ProductCard } from '@/components/ProductCard';
import { whatsappUrl } from '@/lib/config';
import { Clock, Sparkles, MessageCircle } from 'lucide-react';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = await getTranslations('product');
  const tCat = await getTranslations('categories');

  // Related products from same category, excluding current.
  const related = (await listProducts({ locale, category: product.category, limit: 5 })).filter(
    (p) => p.id !== product.id,
  ).slice(0, 4);

  const inStock = product.stock > 0;

  return (
    <article className="section">
      <nav className="mb-6 text-xs text-ink-mute">
        <Link href="/" className="hover:text-baby-500">Kadoa</Link>
        {' / '}
        <Link href={`/category/${product.category}`} className="hover:text-baby-500">
          {tCat(product.category)}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-4xl shadow-soft">
          <PlaceholderImage
            name={product.name}
            category={product.category}
            imageUrl={product.imageUrl}
            imageAlt={product.imageAlt}
            rounded=""
          />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-baby-500">
            {tCat(product.category)}
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-ink-soft">{product.shortDescription}</p>

          <div className="mt-6 flex items-end gap-4">
            <span className="font-display text-4xl font-semibold text-ink">
              {formatPrice(product.priceCents, locale)}
            </span>
            {product.discountCents && (
              <span className="text-lg text-ink-mute line-through">
                {formatPrice(product.discountCents, locale)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baby-50 px-3 py-1.5">
              <Clock className="h-4 w-4 text-baby-500" />
              {t('leadTime')}: {product.leadTime}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-baby-50 text-ink-soft'}`}>
              <Sparkles className="h-4 w-4" />
              {inStock ? t('stock') : t('outOfStock')}
            </span>
          </div>

          <ProductDetailActions product={product} />

          <a
            href={whatsappUrl(`Bonjour Kadoa, je suis intéressé par le produit "${product.name}".`)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <div className="mt-10 border-t border-baby-100 pt-8">
            <h2 className="font-display text-xl font-semibold text-ink">{t('description')}</h2>
            <p className="mt-3 whitespace-pre-line text-ink-soft">{product.longDescription}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-bold text-ink">+ {tCat(product.category)}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
