"use client";

import { useRooms } from '@/hooks/useRooms';
import { BookingForm } from '@/components/BookingForm';

export function BookNowClient() {
  const { loading } = useRooms();

  if (loading) {
    return <div className="h-96 rounded-3xl bg-white/80 shadow-soft" />;
  }

  return <BookingForm />;
}