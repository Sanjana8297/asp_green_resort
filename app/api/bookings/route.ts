import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServiceRole } from '@/lib/supabase-server';
import { buildBookingNotificationHtml, buildBookingNotificationText, sendBookingEmail, sendBookingWhatsApp } from '@/lib/notifications';

export const runtime = 'nodejs';

const bookingSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  room_type: z.string().min(1),
  room_amount: z.coerce.number().min(1),
  check_in: z.string().min(1),
  check_out: z.string().min(1),
  nights: z.coerce.number().min(1),
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  total_amount: z.coerce.number().min(0),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  source: z.string().optional()
});

const notificationEmail = 'aspgreenresort@gmail.com';
const notificationWhatsapp = '+916300115651';

function buildResponse(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);

  if (!payload) {
    return buildResponse(400, { success: false, error: 'Invalid JSON payload.' });
  }

  const parseResult = bookingSchema.safeParse(payload);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((error) => error.message).join(' ');
    return buildResponse(400, { success: false, error: errorMessages });
  }

  const booking = parseResult.data;
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  if (checkOut <= checkIn) {
    return buildResponse(400, { success: false, error: 'Check-out date must be after check-in date.' });
  }

  const { data: overlappingBookings, error: availabilityError } = await supabaseServiceRole
    .from('bookings')
    .select('id')
    .neq('status', 'cancelled')
    .lt('check_in', booking.check_out)
    .gt('check_out', booking.check_in)
    .limit(1);

  if (availabilityError) {
    return buildResponse(500, { success: false, error: availabilityError.message });
  }

  if (overlappingBookings?.length) {
    return buildResponse(409, { success: false, error: 'Choose another date because the rooms are booked for this date.' });
  }

  const insertPayload = {
    ...booking,
    status: booking.status ?? 'pending',
    payment_status: booking.payment_status ?? 'pending',
    source: booking.source ?? 'website'
  };

  const { data, error } = await supabaseServiceRole
    .from('bookings')
    .insert(insertPayload)
    .select('id')
    .single();

  if (error) {
    return buildResponse(500, { success: false, error: error.message });
  }

  const bookingWithId = {
    ...insertPayload,
    id: data?.id ?? null
  };

  const text = buildBookingNotificationText(bookingWithId as any);
  const html = buildBookingNotificationHtml(bookingWithId as any);

  const results = await Promise.allSettled([
    sendBookingEmail(notificationEmail, 'New booking received', text, html),
    sendBookingWhatsApp(notificationWhatsapp, text)
  ]);

  const emailResult = results[0];
  const whatsappResult = results[1];

  const errors: string[] = [];
  if (emailResult.status === 'rejected') {
    errors.push(`Email: ${emailResult.reason instanceof Error ? emailResult.reason.message : emailResult.reason}`);
  } else if (emailResult.value === false) {
    errors.push('Email: SMTP configuration missing or incomplete.');
  }

  if (whatsappResult.status === 'rejected') {
    errors.push(`WhatsApp: ${whatsappResult.reason instanceof Error ? whatsappResult.reason.message : whatsappResult.reason}`);
  } else if (whatsappResult.value === false) {
    errors.push('WhatsApp: Twilio configuration missing or incomplete.');
  }

  if (errors.length > 0) {
    return buildResponse(201, {
      success: true,
      id: data?.id ?? null,
      warning: errors.join(' ')
    });
  }

  return buildResponse(201, { success: true, id: data?.id ?? null });
}
