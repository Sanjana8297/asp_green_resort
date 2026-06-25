import Image from 'next/image';
import { Card } from '@/components/ui/Card';

export function ActivityCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-64 bg-forest-50">
        <Image src="" alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-forest-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
      </div>
    </Card>
  );
}