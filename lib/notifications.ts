import nodemailer from 'nodemailer';
import Twilio from 'twilio';

const emailFrom = process.env.EMAIL_FROM ?? 'aspgreenresort@gmail.com';
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

const isTwilioConfigured = Boolean(twilioAccountSid && twilioAuthToken && twilioWhatsappFrom);

function createTransporter() {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error('Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: smtpPort !== 465
    }
  });
}

export async function sendBookingEmail(to: string, subject: string, text: string, html?: string, replyTo?: string) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: emailFrom,
    to,
    subject,
    text,
    html,
    replyTo
  });
}

export async function sendBookingWhatsApp(to: string, body: string) {
  if (!isTwilioConfigured) {
    return;
  }

  const client = new Twilio(twilioAccountSid as string, twilioAuthToken as string);
  const toPhone = to.replace(/^whatsapp:/, '');
  const fromPhone = twilioWhatsappFrom!.replace(/^whatsapp:/, '');

  await client.messages.create({
    from: `whatsapp:${fromPhone}`,
    to: `whatsapp:${toPhone}`,
    body
  });
}

export function buildBookingNotificationText(values: {
  id: string | null;
  full_name: string;
  phone: string;
  email: string;
  room_type: string;
  room_amount: number;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  total_amount: number;
  status: string;
  payment_status: string;
  source: string;
}) {
  const lines = [
    'New booking received',
    `Booking ID: ${values.id ?? 'N/A'}`,
    `Name: ${values.full_name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Room type: ${values.room_type}`,
    `Rate per night: ₹${values.room_amount.toLocaleString('en-IN')}`,
    `Check-in: ${values.check_in}`,
    `Check-out: ${values.check_out}`,
    `Nights: ${values.nights}`,
    `Adults: ${values.adults}`,
    `Children: ${values.children}`,
    `Total amount: ₹${values.total_amount.toLocaleString('en-IN')}`,
    `Status: ${values.status}`,
    `Payment status: ${values.payment_status}`,
    `Source: ${values.source}`
  ];

  return lines.join('\n');
}

export function buildBookingNotificationHtml(values: {
  id: string | null;
  full_name: string;
  phone: string;
  email: string;
  room_type: string;
  room_amount: number;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  total_amount: number;
  status: string;
  payment_status: string;
  source: string;
}) {
  return `
    <h1>New booking received</h1>
    <ul>
      <li><strong>Booking ID:</strong> ${values.id ?? 'N/A'}</li>
      <li><strong>Name:</strong> ${values.full_name}</li>
      <li><strong>Phone:</strong> ${values.phone}</li>
      <li><strong>Email:</strong> ${values.email}</li>
      <li><strong>Room type:</strong> ${values.room_type}</li>
      <li><strong>Rate per night:</strong> ₹${values.room_amount.toLocaleString('en-IN')}</li>
      <li><strong>Check-in:</strong> ${values.check_in}</li>
      <li><strong>Check-out:</strong> ${values.check_out}</li>
      <li><strong>Nights:</strong> ${values.nights}</li>
      <li><strong>Adults:</strong> ${values.adults}</li>
      <li><strong>Children:</strong> ${values.children}</li>
      <li><strong>Total amount:</strong> ₹${values.total_amount.toLocaleString('en-IN')}</li>
      <li><strong>Status:</strong> ${values.status}</li>
      <li><strong>Payment status:</strong> ${values.payment_status}</li>
      <li><strong>Source:</strong> ${values.source}</li>
    </ul>
  `;
}
