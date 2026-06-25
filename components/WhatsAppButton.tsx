import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export function WhatsAppButton() {
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;

  return (
    <Link href={url} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-soft transition hover:scale-105">
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}