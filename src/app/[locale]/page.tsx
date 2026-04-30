import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { listProducts, CATEGORIES } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import type { Locale } from '@/i18n/routing';
import { Sparkles, Box, Scissors, Printer, ArrowRight } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const featured = await listProducts({ locale, featuredOnly: true, limit: 8 });
  return <HomeUI locale={locale} featured={featured} />;
}

function HomeUI({ locale, featured }: { locale: Locale; featured: Awaited<ReturnType<typeof listProducts>> }) {
  const t = useTranslations('home');
  const tCat = useTranslations('categories');
  const tNav = useTranslations('nav');

  const services = [
    { key: 'print3d', icon: Box },
    { key: 'laser', icon: Scissors },
    { key: 'sublimation', icon: Sparkles },
    { key: 'uv', icon: Printer },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-baby-50 via-cream to-baby-100">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-baby-200 blur-3xl opacity-60" aria-hidden />
        <div className="absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-baby-100 blur-3xl opacity-70" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-baby-500 shadow-sm">
              <Sparkles className="h-3 w-3" /> Lausanne · Suisse
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-ink md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">{t('hero.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/quote" className="btn-secondary">
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.slice(0, 4).map((c, i) => (
                <div
                  key={c}
                  className={`aspect-square overflow-hidden rounded-3xl shadow-soft ${i % 2 ? 'translate-y-6 animate-wobble' : ''}`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <PlaceholderImage name={tCat(c)} category={c} rounded="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">{t('services.title')}</h2>
          <p className="mt-2 text-ink-soft">{t('services.subtitle')}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, icon: Icon }) => (
            <div key={key} className="card transition hover:shadow-glow">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-baby-100 text-baby-500">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                {t(`services.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{t(`services.items.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-baby-50/40">
        <div className="section">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
              {t('categoriesSection.title')}
            </h2>
            <p className="mt-2 text-ink-soft">{t('categoriesSection.subtitle')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/category/${c}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft"
              >
                <PlaceholderImage name={tCat(c)} category={c} rounded="" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                  <span className="font-display text-lg font-semibold text-white">{tCat(c)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">{t('featured.title')}</h2>
              <p className="mt-2 text-ink-soft">{t('featured.subtitle')}</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-baby-500 hover:text-baby-600">
              {tNav('products')} →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-baby-300 via-baby-200 to-baby-100 px-8 py-14 text-center md:py-20">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/40 blur-3xl" aria-hidden />
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">{t('cta.subtitle')}</p>
          <Link href="/quote" className="btn-primary mt-7">
            {t('cta.button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
