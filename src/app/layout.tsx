import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Kadoa Sourires & Souvenirs',
    template: '%s · Kadoa Sourires & Souvenirs',
  },
  description: 'Personnalisation artisanale à Lausanne — impression 3D, gravure laser, sublimation et impression UV.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kadoa.ch'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // The actual <html lang> tag lives in [locale]/layout.tsx so the language
  // attribute follows the active locale. Next 14 allows the [locale] layout
  // to act as the localized html root when this passthrough exists.
  return children;
}
