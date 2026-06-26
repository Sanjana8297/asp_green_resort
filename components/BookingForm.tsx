"use client";

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const roomPackages = [
  { label: 'Single-bedroom', value: 'Single-bedroom', amount: 6000, minGuests: 4, maxGuests: 6, discountLabel: '20%', discountPercent: 0.2 },
  { label: 'Double-bedroom', value: 'Double-bedroom', amount: 10000, minGuests: 6, maxGuests: 10, discountLabel: '20%', discountPercent: 0.2 },
  { label: 'Triple-bedroom', value: 'Triple-bedroom', amount: 15000, minGuests: 10, maxGuests: 14, discountLabel: '30%', discountPercent: 0.3 }
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
}).superRefine((values, ctx) => {
  const selected = roomPackages.find((room) => room.value === values.room_type);

  if (!selected) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select a valid room package.',
      path: ['room_type']
    });
    return;
  }

  const totalGuests = values.adults + values.children;
  if (Number.isNaN(totalGuests) || totalGuests <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter valid guest counts.',
      path: ['adults']
    });
    return;
  }

  if (totalGuests > selected.maxGuests) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Total guests must not exceed ${selected.maxGuests} for this package.`,
      path: ['adults']
    });
  }
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

function getDiscountedAmount(amount: number, discountPercent: number) {
  return Math.round(amount * (1 - discountPercent));
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    referenceId: string;
    full_name: string;
    phone: string;
    email: string;
    room_type: string;
    check_in: string;
    check_out: string;
    nights: number;
    ratePerNight: number;
    discountLabel: string;
    totalAmount: number;
  } | null>(null);

  const roomOptions = useMemo(() => roomPackages, []);

  const handleDownloadReceipt = () => {
    if (!successDetails) return;

    const lines = [
      'ASP Green Resort - Booking Receipt',
      '================================',
      `Reference ID: ${successDetails.referenceId}`,
      `Guest Name: ${successDetails.full_name}`,
      `Phone: ${successDetails.phone}`,
      `Email: ${successDetails.email}`,
      `Room type: ${successDetails.room_type}`,
      `Check-in: ${successDetails.check_in}`,
      `Check-out: ${successDetails.check_out}`,
      `Nights: ${successDetails.nights}`,
      `Rate per night after discount: ₹${successDetails.ratePerNight.toLocaleString('en-IN')}`,
      `Discount: ${successDetails.discountLabel}`,
      `Total cost: ₹${successDetails.totalAmount.toLocaleString('en-IN')}`,
      '',
      'Thank you for booking with us!'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-${successDetails.referenceId || 'receipt'}.txt`;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

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
  const discountedRate = selectedPackage ? getDiscountedAmount(selectedPackage.amount, selectedPackage.discountPercent) : 0;
  const nights = useMemo(() => getNights(checkIn, checkOut), [checkIn, checkOut]);
  const totalAmount = useMemo(() => nights * discountedRate, [nights, discountedRate]);

  useEffect(() => {
    if (!selectedPackage) return;

    if (form.getValues('room_amount') !== discountedRate) {
      form.setValue('room_amount', discountedRate, { shouldValidate: true, shouldDirty: true });
    }
  }, [form, selectedPackage, discountedRate]);

  const guestError = form.formState.errors.adults || form.formState.errors.children;
  const totalGuests = (Number(form.watch('adults')) || 0) + (Number(form.watch('children')) || 0);
  const isGuestCountInvalid = selectedPackage && totalGuests > selectedPackage.maxGuests;

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
      const title = response.id ? 'Booking confirmed' : 'Booking submitted successfully';
      setSuccessMessage(`${title}. Reference ID: ${response.id ?? 'N/A'}. Bill Amount: ₹${billTotal.toLocaleString('en-IN')}`);
      setSuccessDetails({
        referenceId: response.id ?? 'N/A',
        full_name: values.full_name,
        phone: values.phone,
        email: values.email,
        room_type: values.room_type,
        check_in: values.check_in,
        check_out: values.check_out,
        nights: billNights,
        ratePerNight: values.room_amount,
        discountLabel: selectedPackage.discountLabel,
        totalAmount: billTotal
      });
      setShowSuccessDialog(true);
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
            {roomOptions.map((room) => (
              <option key={room.value} value={room.value}>
                {`${room.label} - ₹${room.amount.toLocaleString('en-IN')} (+${room.discountLabel} discount)`}
              </option>
            ))}
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
        {isGuestCountInvalid ? (
          <div className="md:col-span-2 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Total guests must be between {selectedPackage?.minGuests} and {selectedPackage?.maxGuests} for the selected package.
          </div>
        ) : null}
        <div className="md:col-span-2 rounded-3xl border border-forest-100 bg-forest-50 p-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-forest-700">Bill Summary</p>
          <div className="mt-3 grid gap-2 text-sm text-ink md:grid-cols-2">
            <p>Nights: {nights}</p>
            <p>Base rate: ₹{(selectedPackage?.amount ?? 0).toLocaleString('en-IN')}</p>
            <p>Discounted rate: ₹{discountedRate.toLocaleString('en-IN')}</p>
            <p className="font-semibold text-forest-900">Total Bill: ₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">{loading ? 'Submitting...' : 'Reserve Now'}</Button>
        </div>
        {error && !isAvailabilityError(error) ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
        {guestError ? <p className="md:col-span-2 text-sm text-red-600">{guestError.message}</p> : null}
        {successMessage ? <p className="md:col-span-2 text-sm text-forest-700">{successMessage}</p> : null}
        {bookingId ? <p className="md:col-span-2 text-sm text-muted">Latest booking ID: {bookingId}</p> : null}
        </form>
      </Card>

      {showSuccessDialog && successDetails ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="success-dialog-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
            <h3 id="success-dialog-title" className="font-display text-2xl text-forest-900">Booking Confirmed</h3>
            <div className="mt-4 rounded-3xl border border-forest-100 bg-forest-50 p-4 text-sm text-ink">
              <p><strong>Reference ID:</strong> {successDetails.referenceId}</p>
              <p><strong>Room:</strong> {successDetails.room_type}</p>
              <p><strong>Check-in:</strong> {successDetails.check_in}</p>
              <p><strong>Check-out:</strong> {successDetails.check_out}</p>
              <p><strong>Nights:</strong> {successDetails.nights}</p>
              <p><strong>Total cost:</strong> ₹{successDetails.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="mt-4 text-sm text-forest-700">
              {successMessage}
              <p className="mt-3 font-bold">Our team will contact regarding the payment process. THANKYOU</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" onClick={handleDownloadReceipt}>Download Receipt</Button>
              <Button type="button" onClick={() => setShowSuccessDialog(false)}>Close</Button>
            </div>
          </div>
        </div>
      ) : null}

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