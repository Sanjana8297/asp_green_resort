import { Suspense } from 'react';
import { Badge } from '@/components/ui/Badge';
import { BookNowClient } from '@/components/BookNowClient';

export default function BookNowPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <Badge>Book Now</Badge>
        <h1 className="mt-4 font-display text-5xl text-forest-900">Reserve Your Stay</h1>
        <div className="mt-10">
          <Suspense fallback={<div className="h-96 rounded-3xl bg-white/80 shadow-soft" />}>
            <BookNowClient />
          </Suspense>
        </div>
      </div>
    </section>
  );
}