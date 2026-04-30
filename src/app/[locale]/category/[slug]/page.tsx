import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { listProducts, CATEGORIES, type Category } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { CategoryPills } from '@/components/CategoryPills';
import type { Locale } from '@/i18n/routing';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!CATEGORIES.includes(slug as Category)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('categories');
  const tProducts = await getTranslations('products');
  const products = await listProducts({ locale, category: slug as Category });

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-baby-500">
          {tProducts('title')}
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">{t(slug as Category)}</h1>
      </header>

      <div className="mb-10">
        <CategoryPills active={slug} />
      </div>

      {products.length === 0 ? (
        <p className="text-ink-soft">{tProducts('noResults')}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
