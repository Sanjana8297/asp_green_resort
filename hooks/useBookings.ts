"use client";

import { useState } from 'react';

export function useBookings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const createBooking = async (payload: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    setBookingId(null);

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({ success: false, error: 'Invalid server response.' }));

    if (!response.ok || !result.success) {
      const message = typeof result.error === 'string' ? result.error : 'Unable to create booking.';
      setError(message);
      setLoading(false);
      return { success: false as const, error: message };
    }

    setBookingId(result.id ?? null);
    setLoading(false);
    return { success: true as const, id: result.id ?? null };
  };

  return { createBooking, loading, error, bookingId };
}