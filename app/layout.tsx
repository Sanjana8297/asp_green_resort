import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/lib/config';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.tagline,
  icons: {
    icon: [
      { url: '/photos/favicon_io/favicon.ico', sizes: 'any' },
      { url: '/photos/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/photos/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/photos/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/photos/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/photos/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}