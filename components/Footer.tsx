import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/60 bg-forest-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div>
          <Image src="/photos/hero/ASP_logo.jpeg" alt="Logo" width={180} height={72} className="mb-4 h-12 w-auto object-contain" />
          <p className="max-w-sm text-sm text-white/75">{SITE_CONFIG.tagline} with a calm, elevated resort experience surrounded by nature.</p>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-white/75">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl">Contact</h3>
          <div className="space-y-2 text-sm text-white/75">
            <p>{SITE_CONFIG.address}</p>
            <p>{SITE_CONFIG.phone}</p>
            <p>{SITE_CONFIG.email}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-xl">Follow</h3>
          <div className="flex items-center gap-4 text-white/80">
            <Link href={SITE_CONFIG.socialLinks.facebook}><Facebook className="h-5 w-5" /></Link>
            <Link href={SITE_CONFIG.socialLinks.instagram}><Instagram className="h-5 w-5" /></Link>
            <Link href={SITE_CONFIG.socialLinks.youtube}><Youtube className="h-5 w-5" /></Link>
            <Link href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}><MessageCircle className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/60 md:px-6">
        © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
      </div>
      <WhatsAppButton />
    </footer>
  );
}