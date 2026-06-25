"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/lib/config';

const slides = [
  { eyebrow: 'Time to Reconnect', title: 'Pure Bliss in Every Breathtaking Detail', text: 'Experience lush stays, quiet mornings, and curated comfort in one nature-wrapped destination.' },
  { eyebrow: 'Luxury Retreat', title: 'A Farmhouse Escape Crafted for Slow Living', text: 'Celebrate every moment with elegant spaces, warm hospitality, and unforgettable views.' },
  { eyebrow: 'Nature First', title: 'Your Private Resort for Gatherings and Getaways', text: 'Designed for family stays, celebrations, and restorative weekends close to nature.' }
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-ink text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image src="" alt={slides[index].title} fill priority className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
        </motion.div>
      </AnimatePresence>
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-24 md:px-6">
        <motion.div key={slides[index].title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl space-y-7">
          <p className="text-sm uppercase tracking-[0.35em] text-cream/80">{slides[index].eyebrow}</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">{slides[index].title}</h1>
          <p className="max-w-xl text-base leading-8 text-white/80 md:text-lg">{slides[index].text} {SITE_CONFIG.name} invites you into a gentler pace.</p>
          <div className="flex flex-wrap gap-4">
            <Button href="/about" variant="secondary">Discover More</Button>
            <Button href="/book-now" variant="ghost">Book Your Stay</Button>
          </div>
          <div className="flex gap-3 pt-8">
            {slides.map((_, dotIndex) => (
              <button key={dotIndex} onClick={() => setIndex(dotIndex)} className={`h-2 rounded-full transition-all ${dotIndex === index ? 'w-10 bg-cream' : 'w-2 bg-white/40'}`} aria-label={`Go to slide ${dotIndex + 1}`} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}