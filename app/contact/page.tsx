"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SITE_CONFIG } from '@/lib/config';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  message: z.string().min(10)
});

type ContactValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ContactValues) => {
    setStatusMessage(null);
    setIsSubmitting(true);

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    const data = await response.json();
    if (!response.ok || data.success === false) {
      setStatusMessage(data.error || 'Unable to send message. Please try again later.');
    } else {
      setStatusMessage('Message sent successfully. We will get back to you soon.');
      form.reset();
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <section className="relative isolate min-h-[45vh] overflow-hidden bg-forest-900 text-white">
        <Image src="" alt="Contact hero" fill className="object-cover opacity-60" />
        <div className="relative mx-auto flex min-h-[45vh] max-w-7xl items-end px-4 py-20 md:px-6">
          <div>
            <Badge className="border-white/20 bg-white/10 text-white">Contact Us</Badge>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">Get in touch</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6">
          <Card>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <input className="rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Name" {...form.register('name')} />
              <input className="rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Phone" {...form.register('phone')} />
              <input className="rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Email" {...form.register('email')} />
              <textarea className="min-h-40 rounded-2xl border border-forest-100 bg-white px-4 py-3" placeholder="Message" {...form.register('message')} />
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</Button>
              {statusMessage ? <p className="text-sm text-forest-700">{statusMessage}</p> : null}
            </form>
          </Card>
          <div className="space-y-6">
            <Card>
              <h2 className="font-display text-3xl text-forest-900">Contact Info</h2>
              <div className="mt-4 space-y-2 text-muted">
                <p>{SITE_CONFIG.address}</p>
                <p>{SITE_CONFIG.phone}</p>
                <p>{SITE_CONFIG.email}</p>
              </div>
            </Card>
            <Card className="overflow-hidden p-0">
              <iframe
                title="ASP Green Resort location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE_CONFIG.location)}&hl=en&z=15&output=embed`}
                className="h-72 w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="border-t border-forest-100 px-4 py-3">
                <a
                  href={SITE_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-forest-700 hover:text-forest-900"
                >
                  Open in Google Maps
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}