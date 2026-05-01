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

 