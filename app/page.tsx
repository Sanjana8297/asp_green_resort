"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { HeroSlider } from '@/components/HeroSlider';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { ActivityCard } from '@/components/ActivityCard';
import { RoomCard } from '@/components/RoomCard';
import { GalleryGrid } from '@/components/GalleryGrid';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { BookingForm } from '@/components/BookingForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useRooms } from '@/hooks/useRooms';
import { useGallery } from '@/hooks/useGallery';
import { useTestimonials } from '@/hooks/useTestimonials';
import { SITE_CONFIG } from '@/lib/config';

export default function HomePage() {
  const { rooms, loading: roomsLoading } = useRooms();
  const { images, loading: galleryLoading } = useGallery(8);
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const [galleryFilter] = useState('all');

  const galleryPreview = useMemo(() => images.slice(0, 8), [images]);

  return (
    <>
      <HeroSlider />

      <section className="section-padding">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <Badge>Welcome</Badge>
          <div className="mt-6 flex justify-center">
            <Image src="/photos/hero/ASP_logo.jpeg" alt={`${SITE_CONFIG.name} logo`} width={520} height={260} priority className="h-auto w-full max-w-2xl object-contain" />
          </div>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gold">{SITE_CONFIG.location}</p>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted">A serene farmhouse resort experience with elegant stays, premium gathering spaces, and curated outdoor comfort for every kind of getaway.</p>
        </div>
      </section>

      <section className="section-padding bg-white/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FeatureHighlights />
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <Badge>Rooms & Suites</Badge>
              <h2 className="mt-4 font-display text-4xl text-forest-900">Stay in Comfort</h2>
            </div>
            <Button href="/rooms" variant="ghost">View All Rooms</Button>
          </div>
          {roomsLoading ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"><Card className="h-96" /><Card className="h-96" /><Card className="h-96" /></div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{rooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>}
        </div>
      </section>

      <section className="section-padding bg-forest-900 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge className="border-white/20 bg-white/10 text-white">Activities</Badge>
          <h2 className="mt-4 font-display text-4xl">Explore Activities At The Resort</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ActivityCard title="Swimming Pool" description="Relax in a refreshing poolside setting designed for leisure and family fun." />
            <ActivityCard title="Raindance" description="Celebrate the mood with a lively rain dance experience at special moments." />
            <ActivityCard title="Barbeque & Bonfire" description="Evenings under the stars with warm firelight and flavourful gatherings." />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge>Testimonials</Badge>
          <h2 className="mt-4 font-display text-4xl text-forest-900">What Guests Say</h2>
          <div className="mt-10">
            {testimonialsLoading ? <Card className="mx-auto h-72 max-w-4xl" /> : <TestimonialSlider testimonials={testimonials} />}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white/70">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Badge>Reservation</Badge>
          <h2 className="mt-4 font-display text-4xl text-forest-900">Make a Reservation / Book Your Stay</h2>
          <div className="mt-10">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="section-padding">
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