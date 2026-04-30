import { placeholderSvg } from '@/lib/placeholder';
import type { Category } from '@/lib/products';
import { cn } from '@/lib/cn';

type Props = {
  name: string;
  category: Category;
  imageUrl?: string | null;
  imageAlt?: string | null;
  className?: string;
  rounded?: string;
};

export function PlaceholderImage({ name, category, imageUrl, imageAlt, className, rounded = 'rounded-2xl' }: Props) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={imageAlt ?? name} className={cn('h-full w-full object-cover', rounded, className)} />;
  }
  const svg = placeholderSvg(name, category);
  return (
    <div
      className={cn('h-full w-full overflow-hidden', rounded, className)}
      role="img"
      aria-label={name}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
