'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useCart } from '@/stores/cart';
import type { ProductView } from '@/lib/products';
import { Minus, Plus, ShoppingBag, Upload, X } from 'lucide-react';

export function ProductDetailActions({ product }: { product: ProductView }) {
  const t = useTranslations('product');
  const router = useRouter();
  const add = useCart((s) => s.add);
  const setCustomization = useCart((s) => s.setCustomization);
  const open = useCart((s) => s.open);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo deve ter menos de 10MB');
      return;
    }

    setUploadedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = (goCheckout: boolean) => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
      },
      qty,
    );

    // Combine text customization with file upload info
    let customization = custom.trim();
    if (uploadedFile) {
      const fileInfo = `[📎 Foto anexada: ${uploadedFile.name}]`;
      customization = customization ? `${customization}\n${fileInfo}` : fileInfo;
    }

    if (customization) {
      setCustomization(product.id, customization);
      // Store file temporarily for checkout (in sessionStorage for this session)
      if (uploadedFile) {
        sessionStorage.setItem(`product-file-${product.id}`, uploadedFile.name);
      }
    }

    if (goCheckout) router.push('/checkout');
    else open();
  };

  return (
    <div className="mt-8 space-y-4">
      {product.customizable && (
        <div className="space-y-3">
          <label className="label" htmlFor="custom">{t('personalisation')}</label>
          <textarea
            id="custom"
            rows={3}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={t('personalisationPlaceholder')}
            className="input"
          />

          <div className="mt-3">
            <label className="label">Adicionar fotos da ideia (opcional)</label>
            <div className="space-y-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Selecionar foto"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-baby-200 bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:bg-baby-50 transition"
                >
                  <Upload className="h-4 w-4" />
                  {uploadedFile ? 'Trocar foto' : 'Carregar foto'}
                </button>
              </div>

              {uploadedFile && (
                <div className="rounded-lg border border-baby-200 bg-baby-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{uploadedFile.name}</p>
                      <p className="text-xs text-ink-soft">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-ink-soft hover:text-ink transition"
                      aria-label="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {preview && (
                    <div className="mt-3">
                      <img
                        src={preview}
                        alt="Preview da foto"
                        className="max-h-32 w-full rounded object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-baby-50 p-1">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm hover:bg-baby-100" aria-label="-">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm hover:bg-baby-100" aria-label="+">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => handleAdd(false)} className="btn-primary">
          <ShoppingBag className="mr-2 h-4 w-4" />
          {t('addToCart')}
        </button>
        <button onClick={() => handleAdd(true)} className="btn-secondary">
          {t('buyNow')}
        </button>
      </div>
    </div>
  );
}
