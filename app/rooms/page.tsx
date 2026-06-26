"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRooms } from '@/hooks/useRooms';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoomCard } from '@/components/RoomCard';

const packageSlides = [
  {
    id: 'single-bedroom',
    label: 'Family Package',
    title: 'Single Bedroom',
    description: 'A comfortable package for 4 to 6 guests with a peaceful bedroom setup and family-friendly comforts.',
    image: '/photos/rooms/bedroom.jpeg',
    href: '/rooms/single-bedroom',
    badge: 'Family Package',
    highlights: ['4 to 6 members', '₹6,000', '20% discount', 'Food separate cost']
  },
  {
    id: 'double-bedroom',
    label: 'Family Extended Package',
    title: 'Double Bedroom',
    description: 'Spacious overnight stays for 6 to 10 guests with private sleeping areas and gathering space.',
    image: '/photos/rooms/living room.jpeg',
    href: '/rooms/double-bedroom',
    badge: 'Family Extended',
    highlights: ['6 to 10 members', '₹10,000', '20% discount', 'Food separate cost']
  },
  {
    id: 'triple-bedroom',
    label: 'Combo Package',
    title: 'Triple Bedroom',
    description: 'Premium option for 10 to 14 guests with generous living space and elevated hospitality.',
    image: '/photos/rooms/Room_interior.jpeg',
    href: '/rooms/triple-bedroom',
    badge: 'Combo Package',
    highlights: ['10 to 14 members', '₹15,000', '30% discount', 'Food separate cost']
  }
] as const;

const filters = ['all', 'villa', 'container', 'wooden', 'conventional'] as const;

export default function RoomsPage() {
  const { rooms, loading } = useRooms();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('all');

  const filteredRooms = useMemo(() => (activeFilter === 'all' ? rooms : rooms.filter((room) => room.category === activeFilter)), [activeFilter, rooms]);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-3xl bg-forest-50 p-6 shadow-soft">
          <Badge>Rooms</Badge>
          <h1 className="mt-4 font-display text-5xl text-forest-900">All Rooms</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-forest-800">
            Explore our room collection with the best options for every group, from villas to comfortable family stays.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm capitalize ${activeFilter === filter ? 'bg-forest-700 text-white' : 'bg-forest-100 text-forest-900'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-soft">
          <div className="grid gap-6 p-4 sm:grid-cols-1 lg:grid-cols-3">
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

        <div className="mt-10">
          {loading ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"><Card className="h-96" /><Card className="h-96" /><Card className="h-96" /></div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>}
        </div>
      </div>
    </section>
  );
}