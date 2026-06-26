import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendBookingEmail } from '@/lib/notifications';
import { SITE_CONFIG } from '@/lib/config';

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  message: z.string().min(10)
});

function buildResponse(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);
  if (!payload) {
    return buildResponse(400, { success: false, error: 'Invalid JSON payload.' });
  }

  const parseResult = contactSchema.safeParse(payload);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((error) => error.message).join(' ');
    return buildResponse(400, { success: false, error: errorMessages });
  }

  const { name, phone, email, message } = parseResult.data;
  const text = `New contact message received\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
  const html = `
    <h1>New contact message received</h1>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Message:</strong> ${message}</li>
    </ul>
  `;

  const emailSent = await sendBookingEmail(SITE_CONFIG.email, 'New contact message', text, html, email);

  if (!emailSent) {
    return buildResponse(500, { success: false, error: 'Unable to send contact email. Please check SMTP configuration.' });
  }

  return buildResponse(201, { success: true });
}
