"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/lib/types';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadTestimonials = async () => {
      setLoading(true);
      const { data, error: supabaseError } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });

      if (!active) return;

      if (supabaseError) {
        setError(supabaseError.message);
        setTestimonials([]);
      } else {
        setTestimonials((data as Testimonial[]) ?? []);
        setError(null);
      }
      setLoading(false);
    };

    void loadTestimonials();

    return () => {
      active = false;
    };
  }, []);

  return { testimonials, loading, error };
}