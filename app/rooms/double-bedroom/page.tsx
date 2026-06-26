import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BedDouble, CheckCircle2, Users } from 'lucide-react';

export default function DoubleBedroomPage() {
  return (
    <section>
      <div className="bg-forest-900 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl bg-forest-900 px-8 py-10 shadow-soft">
            <Badge className="bg-white/10 text-white">Family Extended Package</Badge>
            <h1 className="mt-4 font-display text-5xl text-white">Family Extended Package (Double Bedroom)</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
              A spacious double-bedroom family package for 6 to 10 members.
              The package costs ₹10,000 plus a 20% discount, with food charged separately.
              Timings are 1:00pm to 11:30am.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding mx-auto max-w-7xl px-4 md:px-6 mt-10 grid gap-8 lg:grid-cols-2">
        <Card className="p-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-forest-50">
            <Image
              src="/photos/rooms/living room.jpeg"
              alt="Family Extended Package living room"
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
                Perfect for families who want a larger stay with private sleeping areas and shared gathering space.
              </p>
            </div>

            <div className="grid gap-4 rounded-3xl border border-forest-100 bg-forest-50 p-6 text-sm text-ink">
              <div className="grid gap-2 rounded-3xl bg-forest-100 p-4">
                <p className="text-sm font-semibold text-forest-900">Package details</p>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Allowed members: 6 to 10</li>
                  <li>Amount: ₹10,000</li>
                  <li>Discount: +20%</li>
                  <li>Timings: 1:00pm to 11:30am</li>
                  <li>Food: separate cost</li>
                  <li>AC accommodation</li>
                  <li>Swimming Pool access</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-ink">Relax in a well-appointed suite designed for extended stays and family gatherings.</p>
              <Button href="/book-now?room=double-bedroom">Book this package</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
