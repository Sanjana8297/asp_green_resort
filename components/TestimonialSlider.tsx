"use client";

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { Card } from '@/components/ui/Card';

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % testimonials.length), 6000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  const testimonial = testimonials[index];

  return (
    <Card className="mx-auto max-w-4xl text-center">
      <div className="mb-4 flex justify-center gap-1 text-gold">
        {Array.from({ length: testimonial.rating }).map((_, starIndex) => <Star key={starIndex} className="h-5 w-5 fill-current" />)}
      </div>
      <p className="mx-auto max-w-3xl text-lg leading-8 text-muted">“{testimonial.review}”</p>
      <p className="mt-6 font-display text-2xl text-forest-900">{testimonial.name}</p>
    </Card>
  );
}