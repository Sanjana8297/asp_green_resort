"use client";

import { useMemo, useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { RoomCard } from '@/components/RoomCard';

const filters = ['all', 'villa', 'container', 'wooden', 'conventional'] as const;

export default function RoomsPage() {
  const { rooms, loading } = useRooms();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('all');

  const filteredRooms = useMemo(() => (activeFilter === 'all' ? rooms : rooms.filter((room) => room.category === activeFilter)), [activeFilter, rooms]);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Badge>Rooms</Badge>
        <h1 className="mt-4 font-display text-5xl text-forest-900">All Rooms</h1>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm capitalize ${activeFilter === filter ? 'bg-forest-700 text-white' : 'bg-white text-ink'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"><Card className="h-96" /><Card className="h-96" /><Card className="h-96" /></div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>}
        </div>
      </div>
    </section>
  );
}