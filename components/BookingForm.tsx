"use client";

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const roomPackages = [
  { label: 'Single-bedroom', value: 'Single-bedroom', amount: 6000 },
  { label: 'Double-bedroom', value: 'Double-bedroom', amount: 10000 },
  { label: 'Triple-bedroom', value: 'Triple-bedroom', amount: 15000 }
] as const;

const bookingSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  room_type: z.string().min(1),
  room_amount: z.coerce.number().min(1),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0)
}).refine((values) => {
  const checkIn = new Date(values.check_in);
  const checkOut = new Date(values.check_out);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date.',
  path: ['check_out']
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function getNights(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff <= 0) return 0;

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function isAvailabilityError(message?: string | null) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  return normalized.includes('choose another date') || normalized.includes('booked for this date');
}

export function BookingForm() {
  const { createBooking, loading, error, bookingId } = useBookings();
  const [successMessage, setSuccessMessage] = useState('');
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const roomOptions = useMemo(() => roomPackages, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room_type: roomOptions[0]?.value ?? '',
      room_amount: roomOptions[0]?.amount ?? 6000,
      adults: 2,
      children: 0
    }
  });

  const roomType = form.watch('room_type');
  const checkIn = form.watch('check_in');
  const checkOut = form.watch('check_out');
  const roomAmount = form.watch('room_amount');

  const selectedPackage = roomOptions.find((room) => room.value === roomType) ?? roomOptions[0];
  const nights = useMemo(() => getNights(checkIn, checkOut), [checkIn, checkOut]);
  const totalAmount = useMemo(() => nights * (roomAmount || selectedPackage?.amount || 0), [nights, roomAmount, selectedPackage]);

  useEffect(() => {
    if (!selectedPackage) return;

    if (form.getValues('room_amount') !== selectedPackage.amount) {
      form.setValue('room_amount', selectedPackage.amount, { shouldValidate: true, shouldDirty: true });
    }
  }, [form, selectedPackage]);

  const onSubmit = async (values: BookingFormValues) => {
    setSuccessMessage('');
    setShowAvailabilityDialog(false);
    setAvailabilityMessage('');
    const billNights = getNights(values.check_in, values.check_out);
    const billTotal = billNights * values.room_amount;
    const response = await createBooking({
      full_name: values.full_name,
      phone: values.phone,
      email: values.email,
      room_type: values.room_type,
      room_amount: values.room_amount,
      check_in: values.check_in,
      check_out: values.check_out,
      nights: billNights,
      adults: values.adults,
      children: values.children,
      total_amount: billTotal,
      status: 'pending',
      payment_status: 'pending',
      source: 'website'
    });

    if (!response.success) {
      const message = response.error ?? '';
      if (isAvailabilityError(message)) {
        setAvailabilityMessage(message);
        setShowAvailabilityDialog(true);
      }
      return;
    }

    if (response.success) {
      setSuccessMessage(response.id ? `Booking confirmed. Reference ID: ${response.id}. Bill Amount: ₹${billTotal.toLocaleString('en-IN')}` : `Booking submitted successfully. Bill Amount: ₹${billTotal.toLocaleString('en-IN')}`);
      form.reset({
        full_name: '',
        phone: '',
        email: '',
        room_type: roomOptions[0]?.value ?? '',
        room_amount: roomOptions[0]?.amount ?? 6000,
        check_in: '',
        check_out: '',
        adults: 2,
        children: 0
      });
    }
  };

  return (
    <>
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="full_name">Full Name</label>
          <input id="full_name" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Enter your full name" {...form.register('full_name')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="phone">Phone Number</label>
          <input id="phone" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Enter your phone number" {...form.register('phone')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="email">Email</label>
          <input id="email" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Enter your email" {...form.register('email')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="room_type">Room</label>
          <select id="room_type" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" {...form.register('room_type')}>
            {roomOptions.map((room) => <option key={room.value} value={room.value}>{`${room.label} {₹${room.amount.toLocaleString('en-IN')}}`}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="check_in">Check In Date</label>
          <input id="check_in" type="date" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" {...form.register('check_in')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="check_out">Check Out Date</label>
          <input id="check_out" type="date" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" {...form.register('check_out')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="adults">Adults</label>
          <input id="adults" type="number" min="1" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" {...form.register('adults')} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-forest-800" htmlFor="children">Children</label>
          <input id="children" type="number" min="0" className="w-full rounded-2xl border border-forest-100 bg-white px-4 py-3" {...form.register('children')} />
        </div>
        <div className="md:col-span-2 rounded-3xl border border-forest-100 bg-forest-50 p-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest-700">Bill Summary</p>
          <div className="mt-3 grid gap-2 text-sm text-ink md:grid-cols-2">
            <p>Nights: {nights}</p>
            <p>Rate per night: ₹{(selectedPackage?.amount ?? 0).toLocaleString('en-IN')}</p>
            <p>Package: {selectedPackage?.label ?? 'N/A'}</p>
            <p className="font-semibold text-forest-900">Total Bill: ₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">{loading ? 'Submitting...' : 'Reserve Now'}</Button>
        </div>
        {error && !isAvailabilityError(error) ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        {successMessage ? <p className="md:col-span-2 text-sm text-forest-700">{successMessage}</p> : null}
        {bookingId ? <p className="md:col-span-2 text-sm text-muted">Latest booking ID: {bookingId}</p> : null}
        </form>
      </Card>

      {showAvailabilityDialog ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="availability-dialog-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <h3 id="availability-dialog-title" className="font-display text-2xl text-forest-900">Rooms Unavailable</h3>
            <p className="mt-3 text-sm leading-6 text-ink">{availabilityMessage || 'Choose another date because the rooms are booked for this date.'}</p>
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={() => setShowAvailabilityDialog(false)}>OK</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}