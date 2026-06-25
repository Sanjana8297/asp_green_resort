"use client";

import { useMemo } from 'react';
import { useGallery } from '@/hooks/useGallery';
import { Badge } from '@/components/ui/Badge';
import { GalleryGrid } from '@/components/GalleryGrid';
import type { GalleryImage } from '@/lib/types';

const localGalleryImages: GalleryImage[] = [
  {
    id: 'local-gallery-main_path',
    url: '/photos/gallery/main_path.jpeg',
    caption: 'Main Path',
    category: 'gallery',
    created_at: '2026-06-26T00:00:00.000Z'
  },
  {
    id: 'local-gallery-outdoor_way_1',
    url: '/photos/gallery/outdoor_way_1.jpeg',
    caption: 'Outdoor Way',
    category: 'gallery',
    created_at: '2026-06-26T00:00:00.000Z'
  },
  {
    id: 'local-gallery-otdoor_way_2',
    url: '/photos/gallery/otdoor_way_2.jpeg',
    caption: 'Outdoor Way 2',
    category: 'gallery',
    created_at: '2026-06-26T00:00:00.000Z'
  },
  {
    id: 'local-gallery-trees_area',
    url: '/photos/gallery/trees_area.jpeg',
    caption: 'Trees Area',
    category: 'gallery',
    created_at: '2026-06-26T00:00:00.000Z'
  },
  {
    id: 'local-rooms-bedroom',
    url: '/photos/rooms/bedroom.jpeg',
    caption: 'Bedroom',
    category: 'rooms',
    created_at: '2026-06-26T00:00:00.000Z'
  },
  {
    id: 'local-rooms-room_interior',
    url: '/photos/rooms/Room_interior.jpeg',
    caption: 'Room Interior',
    category: 'rooms',
    created_at: '2026-06-26T00:00:00.000Z'
  }
];

export default function GalleryPage() {
  const { images } = useGallery();

  const allImages = useMemo(() => {
    const mergedImages = [...localGalleryImages, ...images];
    return mergedImages.filter((image, index, array) => array.findIndex((item) => item.url === image.url) === index);
  }, [images]);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Badge>Gallery</Badge>
        <h1 className="mt-4 font-display text-5xl text-forest-900">Resort Gallery</h1>

        <div className="mt-10">
          <GalleryGrid images={allImages} />
        </div>
      </div>
    </section>
  );
}