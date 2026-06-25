import Image from 'next/image';
import Link from 'next/link';
import type { Room } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function RoomCard({ room }: { room: Room }) {
  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative h-64 w-full overflow-hidden bg-forest-50">
        <Image src="" alt={room.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">{room.category}</p>
          <h3 className="mt-2 font-display text-2xl text-forest-900">{room.name}</h3>
        </div>
        <p className="text-sm leading-7 text-muted">{room.description}</p>
        <div className="flex items-center justify-between text-sm text-ink">
          <span>{room.max_guests} Guests</span>
          <span className="font-semibold text-forest-800">From ₹{room.price_per_night}/night</span>
        </div>
        <div className="flex gap-3">
          <Button href="/book-now" className="flex-1">Book Now</Button>
          <Button href={`/rooms/${room.slug}`} variant="ghost" className="flex-1 border border-forest-100">Details</Button>
        </div>
      </div>
    </Card>
  );
}