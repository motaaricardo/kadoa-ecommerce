import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/lib/config';
import { Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');
  const tSite = useTranslations('site');

  return (
    <footer className="mt-24 border-t border-baby-100 bg-baby-50/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-300 font-display text-lg font-bold text-white">
              K
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-cormorant text-base font-semibold text-ink">
                {'Kadoa'.split('').map((char, idx) =>
                  char.toLowerCase() === 'o' ? (
                    <span key={idx} className="text-accent-500">
                      {char}
                    </span>
                  ) : (
                    <span key={idx}>{char}</span>
                  )
                )}
              </span>
              <span className="text-[11px] text-ink-soft">Sourires & Souvenirs</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-soft">{t('tagline')}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink-soft hover:bg-baby-100 hover:text-accent-500"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink-soft hover:bg-baby-100 hover:text-accent-500"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            {t('shop')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li><Link href="/products" className="hover:text-accent-500">{tNav('products')}</Link></li>
            <li><Link href="/category/baby_shower" className="hover:text-accent-500">{tCat('baby_shower')}</Link></li>
            <li><Link href="/category/wedding" className="hover:text-accent-500">{tCat('wedding')}</Link></li>
            <li><Link href="/category/corporate" className="hover:text-accent-500">{tCat('corporate')}</Link></li>
            <li><Link href="/category/baptism" className="hover:text-accent-500">{tCat('baptism')}</Link></li>
            <li><Link href="/category/birthday" className="hover:text-accent-500">{tCat('birthday')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            {t('company')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li><Link href="/about" className="hover:text-accent-500">{tNav('about')}</Link></li>
            <li><Link href="/quote" className="hover:text-accent-500">{tNav('quote')}</Link></li>
            <li><Link href="/faq" className="hover:text-accent-500">{tNav('faq')}</Link></li>
            <li><Link href="/contact" className="hover:text-accent-500">{tNav('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink">
            {t('support')}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-accent-500" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-500">{siteConfig.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 text-accent-500" />
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-accent-500">
                +{siteConfig.whatsappNumber.replace(/(\d{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-accent-500" />
              <span>{siteConfig.city}, {siteConfig.country}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-baby-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-mute md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} {tSite('name')}. {t('rights')}</p>
          <p>{t('legal')}</p>
        </div>
      </div>
    </footer>
  );
}
