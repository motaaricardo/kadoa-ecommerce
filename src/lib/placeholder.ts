// Generates a brand-coloured SVG placeholder for products that don't yet have a real image.
// Can be used as a data URL or rendered inline. The admin can later upload a real image
// per product (`Product.imageUrl`) and the SVG falls away automatically.

import type { Category } from './products';

const PALETTES: Record<Category, [string, string, string]> = {
  baby_shower: ['#FFD9E8', '#FFB6D9', '#FFFBF7'],
  corporate:   ['#F1E8FF', '#C9B8E8', '#FFFBF7'],
  wedding:     ['#FFE4F0', '#F894C3', '#FFFBF7'],
  baptism:     ['#FFF0F6', '#FFC0E3', '#FFFFFF'],
  birthday:    ['#FFE9CC', '#FFB6D9', '#FFFBF7'],
  travel_souvenirs: ['#E0F7FF', '#87CEEB', '#FFFFFF'],
  kadoa_products: ['#FFF8DC', '#FFD700', '#FFFBF7'],
  customizable_products: ['#F0E6FF', '#D8BFD8', '#FFFBF7'],
};

const ICONS: Record<Category, string> = {
  baby_shower: '🍼',
  corporate:   '💼',
  wedding:     '💍',
  baptism:     '🕊️',
  birthday:    '🎂',
  travel_souvenirs: '✈️',
  kadoa_products: '🎁',
  customizable_products: '🎨',
};

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
}

export function placeholderSvg(name: string, category: Category, w = 800, h = 800): string {
  const [c1, c2, c3] = PALETTES[category];
  const icon = ICONS[category];
  const safe = escapeXml(name.length > 28 ? name.slice(0, 27) + '…' : name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="s" cx="0.7" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="${c3}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#s)"/>
  <circle cx="${w * 0.18}" cy="${h * 0.82}" r="${w * 0.22}" fill="${c3}" fill-opacity="0.35"/>
  <circle cx="${w * 0.85}" cy="${h * 0.18}" r="${w * 0.15}" fill="${c3}" fill-opacity="0.4"/>
  <text x="50%" y="42%" font-family="ui-serif, Georgia, serif" font-size="${w * 0.22}" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="50%" y="68%" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600" font-size="${w * 0.045}" fill="#2C2C2C" text-anchor="middle">${safe}</text>
  <text x="50%" y="76%" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${w * 0.028}" fill="#5C5C5C" text-anchor="middle" letter-spacing="2">KADOA</text>
</svg>`;
}

export function placeholderDataUrl(name: string, category: Category): string {
  const svg = placeholderSvg(name, c