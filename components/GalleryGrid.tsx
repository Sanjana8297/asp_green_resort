"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';
import { Card } from '@/components/ui/Card';

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((image) => (
          <button key={image.id} onClick={() => setActiveImage(image)} className="overflow-hidden rounded-3xl">
            <Card className="p-0">
              <div className="relative aspect-[4/5] bg-forest-50">
                <Image src={image.url} alt={image.caption} fill className="object-cover" />
              </div>
            </Card>
          </button>
        ))}
      </div>

      {activeImage ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4" onClick={() => setActiveImage(null)}>
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white" onClick={(event) => event.stopPropagation()}>
            <div className="relative aspect-[16/10] bg-forest-50">
              <Image src={activeImage.url} alt={activeImage.caption} fill className="object-cover" />
            </div>
            <div className="p-4 text-center">
              <p className="font-display text-xl text-forest-900">{activeImage.caption}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}