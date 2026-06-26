import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import type { GalleryImage } from '@/lib/types';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function getImagesFromDirectory(directory: string, category: string): GalleryImage[] {
  const directoryPath = join(process.cwd(), 'public', directory);

  try {
    const files = readdirSync(directoryPath);
    return files
      .filter((file) => IMAGE_EXTENSIONS.some((ext) => file.toLowerCase().endsWith(ext)))
      .map((file) => {
        const filePath = join(directoryPath, file);
        const stats = statSync(filePath);
        return {
          id: `${category}-${file}`,
          url: `/${directory}/${file}`,
          caption: file.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''),
          category,
          created_at: stats.mtime.toISOString()
        };
      });
  } catch (error) {
    console.error(`Unable to load images from ${directoryPath}:`, error);
    return [];
  }
}

export async function GET() {
  const galleryImages = getImagesFromDirectory('photos/gallery', 'gallery');
  const roomImages = getImagesFromDirectory('photos/rooms', 'rooms');

  const images = [...galleryImages, ...roomImages].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return new Response(JSON.stringify(images), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
