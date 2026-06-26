"use client";

import { useEffect, useState } from 'react';
import type { GalleryImage } from '@/lib/types';

export function useGallery(limit?: number) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      setLoading(true);

      try {
        const response = await fetch('/api/gallery-images');
        if (!response.ok) {
          throw new Error(`Unable to load gallery images: ${response.statusText}`);
        }

        const data = (await response.json()) as GalleryImage[];
        if (!active) return;

        const sortedImages = data.sort((a, b) => b.created_at.localeCompare(a.created_at));
        setImages(limit ? sortedImages.slice(0, limit) : sortedImages);
        setError(null);
      } catch (fetchError: unknown) {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : 'Unknown error fetching gallery images.');
        setImages([]);
      }

      setLoading(false);
    };

    void loadImages();

    return () => {
      active = false;
    };
  }, [limit]);

  return { images, loading, error };
}