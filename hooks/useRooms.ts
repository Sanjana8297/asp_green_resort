"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Room } from '@/lib/types';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadRooms = async () => {
      setLoading(true);
      const { data, error: supabaseError } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });

      if (!active) return;

      if (supabaseError) {
        setError(supabaseError.message);
        setRooms([]);
      } else {
        setRooms((data as Room[]) ?? []);
        setError(null);
      }

      setLoading(false);
    };

    void loadRooms();

    return () => {
      active = false;
    };
  }, []);

  return { rooms, loading, error };
}