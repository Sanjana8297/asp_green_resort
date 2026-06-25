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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6">
          <div>
            <Badge>Our Story</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest-900">A farmhouse built for connection and calm</h2>
            <p className="mt-6 leading-8 text-muted">This placeholder copy can be edited easily in the component or replaced with your final brand story. The goal is to communicate a premium, nature-first escape with flexible stays, family gatherings, and event-ready lawns.</p>
          </div>
          <Card>
            <h3 className="font-display text-2xl text-forest-900">Management</h3>
            <div className="mt-6 flex items-center gap-4">
              <img src="" alt="Management" className="h-20 w-20 rounded-full bg-forest-50" />
              <div>
                <p className="font-semibold text-ink">Resort Management</p>
                <p className="text-sm text-muted">Dedicated hospitality leadership</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-padding bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-4 md:px-6">
          {[
            ['10+', 'Years'],
            ['5k+', 'Happy Guests'],
            ['20+', 'Acres'],
            ['15+', 'Activities']
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