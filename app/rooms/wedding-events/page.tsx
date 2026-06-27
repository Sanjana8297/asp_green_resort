import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function WeddingEventsPage() {
  return (
    <section>
      <div className="bg-forest-900 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl bg-forest-900 px-8 py-10 shadow-soft">
            <Badge className="bg-white/10 text-white">Events Package</Badge>
            <h1 className="mt-4 font-display text-5xl text-white">Wedding / Events / Celebrations</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
              Celebrate your biggest moments at our sprawling green venue. This package hosts 100 to 150 guests
              at ₹1,500 per head, inclusive of food, rooms, and all amenities — along with swimming pool access
              and ample parking.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding mx-auto max-w-7xl px-4 md:px-6 mt-10 grid gap-8 lg:grid-cols-2">
        <Card className="p-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-forest-50">
            <Image
              src="/photos/gallery/otdoor_way_2.jpeg"
              alt="Wedding and events venue"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Card>

        <div className="rounded-3xl bg-forest-50 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl text-forest-900">Package Highlights</h2>
              <p className="mt-3 text-muted">
                A complete celebration experience with lush outdoor spaces, comfortable stays, and dedicated
                hospitality to make weddings, parties, and corporate events effortless.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-forest-100 bg-forest-50 p-6 text-sm text-ink">
              <div className="grid gap-2 rounded-3xl bg-forest-100 p-4">
                <p className="text-sm font-semibold text-forest-900">Package details</p>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Capacity: 100 to 150 guests</li>
                  <li>Amount: ₹1,500 per head</li>
                  <li>Food included</li>
                  <li>Rooms and all amenities included</li>
                  <li>Swimming pool access</li>
                  <li>Parking available</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-ink">Reserve the entire venue and let us handle the rest for your special day.</p>
              <Button href="/book-now?room=wedding-events">Book this package</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
