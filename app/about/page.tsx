import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SITE_CONFIG } from '@/lib/config';

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate min-h-[55vh] overflow-hidden bg-forest-900 text-white">
        <Image src="" alt="About hero" fill className="object-cover opacity-60" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-end px-4 py-20 md:px-6">
          <div>
            <Badge className="border-white/20 bg-white/10 text-white">About Us</Badge>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">About {SITE_CONFIG.name}</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div>
            <Badge>Our Story</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest-900">A green farmhouse retreat built for connection and calm</h2>
            <p className="mt-6 leading-8 text-muted">
              Tucked away in Kammeta Village near Shankarpalli, just opposite Pragathi Resorts, {SITE_CONFIG.name} is a
              sprawling green escape made for people who want to slow down without going far from the city. With acres of
              open lawns, fresh country air, and flexible single, double, and triple bedroom packages that comfortably
              host groups of every size, it is the perfect setting for relaxed family weekends, milestone celebrations,
              and get-togethers with friends. More than a place to stay, {SITE_CONFIG.name} is built around warm,
              attentive hospitality and event-ready spaces, where our team handles every detail so your stay feels
              effortless, personal, and worth coming back to.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-6">
          {[
            ['5+', 'Years'],
            ['5k+', 'Happy Guests'],
            ['1', 'Acre']
          ].map(([value, label]) => (
            <Card key={label} className="text-center">
              <p className="font-display text-4xl text-forest-700">{value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">{label}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}