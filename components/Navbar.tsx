"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';

const roomOptions = [
  { label: 'Family Package (Single Bedroom)', href: '/rooms/single-bedroom' },
  { label: 'Family Extended Package (Double Bedroom)', href: '/rooms/double-bedroom' },
  { label: 'Combo Package (Triple Package)', href: '/rooms/triple-bedroom' }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const roomsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roomsOpen && roomsRef.current && !roomsRef.current.contains(event.target as Node)) {
        setRoomsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roomsOpen]);

  return (
    <header className={cn('sticky top-0 z-50 transition-all', scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent')}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-32 overflow-hidden rounded-2xl border border-forest-100 bg-white/95">
            <Image src="/photos/hero/ASP_logo.jpeg" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="font-display text-lg text-forest-800">{SITE_CONFIG.name}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Resort</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-ink hover:text-forest-700">Home</Link>
          <Link href="/about" className="text-sm font-medium text-ink hover:text-forest-700">About Us</Link>
          <div className="relative" ref={roomsRef}>
            <button
              type="button"
              onClick={() => setRoomsOpen((value) => !value)}
              className="flex items-center gap-1 text-sm font-medium text-ink hover:text-forest-700"
            >
              Rooms <ChevronDown className="h-4 w-4" />
            </button>
            {roomsOpen ? (
              <div className="absolute left-0 top-full mt-3 min-w-64 rounded-2xl border border-white/70 bg-white p-2 shadow-soft">
                {roomOptions.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setRoomsOpen(false)}
                    className="block rounded-xl px-4 py-2 text-sm text-ink hover:bg-forest-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/gallery" className="text-sm font-medium text-ink hover:text-forest-700">Gallery</Link>
          <Link href="/contact" className="text-sm font-medium text-ink hover:text-forest-700">Contact Us</Link>
          <Button href="/book-now" variant="secondary">Book Now</Button>
        </nav>

        <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/70 bg-white/95 px-4 py-4 shadow-soft md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-forest-800">Rooms</span>
              {roomOptions.map((item) => (
                <Link key={item.label} href={item.href} className="pl-3 text-sm text-ink hover:text-forest-700">
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact Us</Link>
            <Button href="/book-now" variant="secondary" className="mt-2 w-full">Book Now</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}