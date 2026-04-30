import { setRequestLocale, getTranslations } from 'next-intl/server';
import { listProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { CategoryPills } from '@/components/CategoryPills';
import type { Locale } from '@/i18n/routing';

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const products = await listProducts({ locale });

  return (
    <section className="section">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
        <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
      </header>

      <div className="mb-10">
        <CategoryPills />
      </div>

      {products.length === 0 ? (
        <p className="text-ink-soft">{t('noResults')}</p>
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
