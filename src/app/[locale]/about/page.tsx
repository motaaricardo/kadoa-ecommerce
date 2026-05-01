import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { Award, Heart, Leaf, ArrowRight } from 'lucide-react';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tNav = await getTranslations('nav');

  const values = [
    { key: 'quality', icon: Award },
    { key: 'custom', icon: Heart },
    { key: 'local', icon: Leaf },
  ] as const;

  return (
    <>
      <section className="section">
        <header className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">Kadoa</span>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">{t('title')}</h1>
          <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-square overflow-hidden rounded-4xl bg-gradient-to-br from-baby-200 via-baby-100 to-baby-50 shadow-soft" />
          <div>
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">{t('story.title')}</h2>
            <p className="mt-4 text-ink-soft md:text-lg">{t('story.body')}</p>
            <Link href="/quote" className="btn-primary mt-8">
              {tNav('quote')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-baby-50/40">
        <div className="section">
          <h2 className="mb-10 font-display text-3xl font-bold text-ink md:text-4xl">{t('values.title')}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ key, icon: Icon }) => (
              <div key={key} className="card">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-baby-100 text-accent-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{t(`values.items.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
