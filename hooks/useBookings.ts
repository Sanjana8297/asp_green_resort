"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const createBooking = async (payload: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    setBookingId(null);

    const checkIn = typeof payload.check_in === 'string' ? payload.check_in : '';
    const checkOut = typeof payload.check_out === 'string' ? payload.check_out : '';

    if (!checkIn || !checkOut) {
      const message = 'Please select valid check-in and check-out dates.';
      setError(message);
      setLoading(false);
      return { success: false as const, error: message };
    }

    // Overlap rule: existing.check_in < new.check_out AND existing.check_out > new.check_in.
    const { data: overlappingBookings, error: availabilityError } = await supabase
      .from('bookings')
      .select('id')
      .neq('status', 'cancelled')
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)
      .limit(1);

    if (availabilityError) {
      setError(availabilityError.message);
      setLoading(false);
      return { success: false as const, error: availabilityError.message };
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      const message = 'Choose another date because the rooms are booked for this date.';
      setError(message);
      setLoading(false);
      return { success: false as const, error: message };
    }

    const { data, error: supabaseError } = await supabase.from('bookings').insert(payload).select('id').single();

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
      return { success: false as const, error: supabaseError.message };
    }

    setBookingId(data?.id ?? null);
    setLoading(false);
    return { success: true as const, id: data?.id ?? null };
  };

  return { createBooking, loading, error, bookingId };
}