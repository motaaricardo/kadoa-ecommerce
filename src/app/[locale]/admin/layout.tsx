import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LayoutDashboard, Package, ShoppingBag, FileText, Settings as SettingsIcon } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession(authOptions);

  // Public sub-route: /admin/login is allowed without a session.
  // We can't read the path here, so we render the children directly when there's
  // no session and rely on the page-level guard. For simplicity, the login page
  // is in this layout and will display normally; everything else is gated.
  if (!session) {
    return <>{children}</>;
  }

  const t = await getTranslations('admin.nav');

  const links = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/products', label: t('products'), icon: Package },
    { href: '/admin/orders', label: t('orders'), icon: ShoppingBag },
    { href: '/admin/quotes', label: t('quotes'), icon: FileText },
    { href: '/admin/settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6">
      <aside className="md:sticky md:top-24 md:self-start">
        <nav className="space-y-1 rounded-3xl bg-white p-3 shadow-soft">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href as any}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-baby-50 hover:text-accent-500"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="border-t border-baby-100 pt-2">
            <LogoutButton label={t('logout')} />
          </div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
