import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { formatPrice } from '@/lib/format';
import { pickLocale } from '@/lib/products';
import type { Locale } from '@/i18n/routing';
import { Plus, Pencil } from 'lucide-react';
import { DeleteProductButton } from './DeleteProductButton';

export default async function AdminProducts({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/admin/login`);
  const t = await getTranslations('admin.products');
  const tCat = await getTranslations('categories');

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-ink">{t('title')}</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> {t('new')}
        </Link>
      </header>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-mute">
            <tr>
              <th className="py-2 text-left">{t('name')}</th>
              <th className="py-2 text-left">{t('category')}</th>
              <th className="py-2 text-right">{t('price')}</th>
              <th className="py-2 text-right">{t('stock')}</th>
              <th className="py-2 text-left">{t('status')}</th>
              <th className="py-2 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-baby-100">
                <td className="py-2.5">
                  <div className="font-medium text-ink">{pickLocale(p.name, locale)}</div>
                  <div className="text-xs text-ink-mute">{p.slug}</div>
                </td>
                <td className="py-2.5">{tCat(p.category as any)}</td>
                <td className="py-2.5 text-right">{formatPrice(p.priceCents, locale)}</td>
                <td className="py-2.5 text-right">{p.stock}</td>
                <td className="py-2.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-baby-50 text-ink-mute'}`}>
                    {p.active ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <div className="inline-flex gap-1">
                    <Link href={`/admin/products/${p.id}` as any} className="grid h-8 w-8 place-items-center rounded-full bg-baby-50 hover:bg-baby-100" aria-label={t('edit')}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteProductButton id={p.id} confirmLabel={t('confirmDelete')} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
