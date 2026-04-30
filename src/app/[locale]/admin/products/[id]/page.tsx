import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '../ProductForm';
import type { Locale } from '@/i18n/routing';

export default async function EditProductPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return (
    <ProductForm
      initial={{
        id: product.id,
        slug: product.slug,
        category: product.category,
        name: JSON.parse(product.name),
        shortDescription: JSON.parse(product.shortDescription),
        longDescription: JSON.parse(product.longDescription),
        priceCents: product.priceCents,
        stock: product.stock,
        leadTime: product.leadTime,
        customizable: product.customizable,
        active: product.active,
        featured: product.featured,
        imageUrl: product.imageUrl,
        imageAlt: product.imageAlt,
      }}
    />
  );
}
