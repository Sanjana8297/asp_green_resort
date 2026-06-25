"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/lib/types';

export function useGallery(limit?: number) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      setLoading(true);
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error: supabaseError } = await query;

      if (!active) return;

      if (supabaseError) {
        setError(supabaseError.message);
        setImages([]);
      } else {
        setImages((data as GalleryImage[]) ?? []);
        setError(null);
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