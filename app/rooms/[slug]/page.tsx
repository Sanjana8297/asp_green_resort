import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Room } from '@/lib/types';
import { BedDouble, CheckCircle2, Users } from 'lucide-react';
import { hasSupabaseEnv, supabase } from '@/lib/supabase';

async function getRoom(slug: string): Promise<Room | null> {
  if (!hasSupabaseEnv) {
    return null;
  }

  const { data } = await supabase.from('rooms').select('*').eq('slug', slug).single();
  return (data as Room) ?? null;
}

export default async function RoomDetailPage({ params }: { params: { slug: string } }) {
  const room = await getRoom(params.slug);

  if (!room) {
    return (
      <section className="section-padding">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <Badge>Room Details</Badge>
          <h1 className="mt-4 font-display text-5xl text-forest-900">Room details will appear here once Supabase is connected.</h1>
          <p className="mt-6 text-muted">Add your Supabase environment variables and room records to enable the live room detail view.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card className="h-72" />
            <Card className="h-72" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Badge>Room Details</Badge>
        <h1 className="mt-4 font-display text-5xl text-forest-900">{room.name}</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Card className="p-0">
            <div className="grid gap-4 p-4 md:grid-cols-2">
              {room.images.slice(0, 4).map((_, index) => (
                <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest-50">
                  <Image src="" alt={room.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </Card>
          <div>
            <p className="leading-8 text-muted">{room.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Max Guests: {room.max_guests}</span>
              <span className="inline-flex items-center gap-2"><BedDouble className="h-4 w-4" /> From ₹{room.price_per_night}/night</span>
            </div>
            <div className="mt-8">
              <h2 className="font-display text-2xl text-forest-900">Amenities</h2>
              <div className="mt-4 grid gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-muted"><CheckCircle2 className="h-4 w-4 text-forest-700" />{amenity}</div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <Button href={`/book-now?room=${room.slug}`}>Book Now</Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Badge>Related Rooms</Badge>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card className="h-80" />
            <Card className="h-80" />
            <Card className="h-80" />
          </div>
        </div>
      </div>
    </section>
  );
}