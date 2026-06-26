"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { HeroSlider } from '@/components/HeroSlider';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { GalleryGrid } from '@/components/GalleryGrid';
import { BookingForm } from '@/components/BookingForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useGallery } from '@/hooks/useGallery';
import { SITE_CONFIG } from '@/lib/config';

const packageSlides = [
  {
    id: 'single-bedroom',
    badge: 'Family Package',
    title: 'Single Bedroom',
    description: 'A comfortable stay for 4 to 6 guests with a cozy private bedroom and family comforts.',
    image: '/photos/rooms/bedroom.jpeg',
    href: '/rooms/single-bedroom',
    highlights: ['4 to 6 members', '₹6,000', '20% discount', 'Food separate cost']
  },
  {
    id: 'double-bedroom',
    badge: 'Family Extended Package',
    title: 'Double Bedroom',
    description: 'A spacious package for 6 to 10 guests with room to relax, reconnect, and celebrate.',
    image: '/photos/rooms/living room.jpeg',
    href: '/rooms/double-bedroom',
    highlights: ['6 to 10 members', '₹10,000', '20% discount', 'Food separate cost']
  },
  {
    id: 'triple-bedroom',
    badge: 'Combo Package',
    title: 'Triple Bedroom',
    description: 'Premium accommodation for 10 to 14 guests with extra space and elevated comfort.',
    image: '/photos/rooms/Room_interior.jpeg',
    href: '/rooms/triple-bedroom',
    highlights: ['10 to 14 members', '₹15,000', '30% discount', 'Food separate cost']
  }
] as const;

export default function HomePage() {
  const { images, loading: galleryLoading } = useGallery(8);
  const [galleryFilter] = useState('all');

  const galleryPreview = useMemo(() => images.slice(0, 8), [images]);

  return (
    <>
      <HeroSlider />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <Badge>Welcome</Badge>
          <div className="mt-6 flex justify-center">
            <Image src="/photos/hero/ASP_logo.jpeg" alt={`${SITE_CONFIG.name} logo`} width={520} height={260} priority className="h-auto w-full max-w-2xl object-contain" />
          </div>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gold">{SITE_CONFIG.location}</p>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted">A serene farmhouse resort experience with elegant stays, premium gathering spaces, and curated outdoor comfort for every kind of getaway.</p>
        </div>
      </section>

      <section className="section-padding bg-forest-900 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FeatureHighlights />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10">
            <Badge>Rooms & Suites</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest-900">Stay in Comfort</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {packageSlides.map((slide) => (
              <Card key={slide.id} className="group overflow-hidden p-0">
                <div className="relative h-96 overflow-hidden">
                  <Image src={slide.image} alt={slide.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/90">{slide.badge}</span>
                    <h3 className="mt-4 text-3xl font-semibold">{slide.title}</h3>
                  </div>
                  <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="w-full rounded-3xl bg-black/80 p-6 text-white backdrop-blur-sm">
                      <p className="text-sm text-white/80">{slide.description}</p>
                      <ul className="mt-4 space-y-2 text-sm text-white/80">
                        {slide.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-center gap-2">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-forest-400" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 text-right">
                        <Button href={slide.href} variant="secondary">View More</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-forest-900 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="text-white">Reservation</Badge>
          <h2 className="mt-4 font-display text-4xl text-white">Make a Reservation / Book Your Stay</h2>
          <div className="mt-10">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <Badge>Gallery</Badge>
              <h2 className="mt-4 font-display text-4xl text-forest-900">Gallery / Resort Images</h2>
            </div>
            <Button href="/gallery" variant="ghost">View All</Button>
          </div>
          {galleryLoading ? <Card className="h-96" /> : <GalleryGrid images={galleryPreview} />}
        </div>
      </section>
    </>
  );
}