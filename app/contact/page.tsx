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
            <Card>
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3802.3496801027246!2d78.28843907430558!3d17.331444082824276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8c7f52be3e69%3A0xdda1fd4d0755f235!2sPragathi%20Resorts!5e0!3m2!1sen!2sin!4v1700000000000"
                className="h-72 w-full rounded-2xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}