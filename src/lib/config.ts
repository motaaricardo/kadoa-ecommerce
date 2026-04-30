// Single source of truth for site-wide constants and contact info.
// Values come from environment variables with sensible defaults so the site
// always renders, even before .env is configured.

export const siteConfig = {
  name: 'Kadoa Sourires & Souvenirs',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kadoa.ch',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? 'info@kadoa.ch',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '41767627946',
  city: 'Lausanne',
  country: 'Switzerland',
  social: {
    instagram: 'https://www.instagram.com/kadoa.ch',
    facebook: 'https://www.facebook.com/kadoa.ch',
  },
};

export const whatsappUrl = (message?: string) => {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
