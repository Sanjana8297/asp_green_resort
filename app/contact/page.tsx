"use client";

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { SITE_CONFIG } from '@/lib/config';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  message: z.string().min(10)
});

type ContactValues = z.infer<typeof schema>;

export default function ContactPage() {
  const form = useForm<ContactValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ContactValues) => {
    await supabase.from('contact_messages').insert(values);
    form.reset();
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
              <Button type="submit">Send Message</Button>
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
              <iframe title="Map" src="" className="h-72 w-full rounded-2xl border-0" />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}