import { prisma } from './prisma';
import type { Locale } from '@/i18n/routing';

export type Loc = { fr: string; en: string; de: string; pt: string };

export const CATEGORIES = ['baby_shower', 'corporate', 'wedding', 'baptism', 'birthday', 'travel_souvenirs', 'kadoa_products', 'customizable_products'] as const;
export type Category = (typeof CATEGORIES)[number];

export function pickLocale(jsonString: string, locale: Locale): string {
  try {
    const obj = JSON.parse(jsonString) as Loc;
    return obj[locale] || obj.fr || obj.en || '';
  } catch {
    // Fallback for unmigrated plain strings
    return jsonString;
  }
}

export type ProductView = {
  id: string;
  slug: string;
  category: Category;
  name: string;
  shortDescription: string;
  longDescription: string;
  priceCents: number;
  discountCents: number | null;
  stock: number;
  leadTime: string;
  customizable: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  featured: boolean;
};

export function toProductView(
  p: Awaited<ReturnType<typeof prisma.product.findFirstOrThrow>>,
  locale: Locale,
): ProductView {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category as Category,
    name: pickLocale(p.name, locale),
    shortDescription: pickLocale(p.shortDescription, locale),
    longDescription: pickLocale(p.longDescription, locale),
    priceCents: p.priceCents,
    discountCents: p.discountCents,
    stock: p.stock,
    leadTime: p.leadTime,
    customizable: p.customizable,
    imageUrl: p.imageUrl,
    imageAlt: p.imageAlt,
    featured: p.featured,
  };
}

export async function listProducts(opts?: {
  category?: Category | 'all';
  locale?: Locale;
  featuredOnly?: boolean;
  activeOnly?: boolean;
  limit?: number;
}): Promise<ProductView[]> {
  const locale = opts?.locale ?? 'fr';
  const where: any = {};
  if (opts?.activeOnly !== false) where.active = true;
  if (opts?.category && opts.category !== 'all') where.category = opts.category;
  if (opts?.featuredOnly) where.featured = true;

  const rows = await prisma.product.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: opts?.limit,
  });
  return rows.map((r) => toProductView(r, locale));
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductView | null> {
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p || !p.active) return null;
  return toProductView(p, locale);
}
