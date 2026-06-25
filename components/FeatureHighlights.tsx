import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  ['Convention & Lawns', 'Flexible lawns and event spaces for gatherings and celebrations.'],
  ['AC Accommodation', 'Comfortable stays with curated interiors and cooling comfort.'],
  ['Outdoor & Indoor Activities', 'Balanced recreation for all ages, in every season.'],
  ['Luxury Staycations', 'Designed for restful weekends and memorable escapes.'],
  ['Photoshoots', 'Scenic corners and curated backdrops for special captures.'],
  ['Café', 'Fresh bites, warm drinks, and relaxed resort dining moments.']
];

export function FeatureHighlights() {
  return (
    <div className="grid grid-flow-col auto-cols-[80%] gap-4 overflow-x-auto pb-2 md:grid-cols-3 md:auto-cols-auto md:overflow-visible lg:grid-cols-6">
      {features.map(([title, description], index) => (
        <Card key={title} className="group min-h-52 transition-transform duration-300 hover:-translate-y-1">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-display text-4xl text-forest-200">0{index + 1}</span>
            <Sparkles className="h-5 w-5 text-gold transition group-hover:rotate-12" />
          </div>
          <h3 className="font-display text-2xl text-forest-900">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
        </Card>
      ))}
    </div>
  );
}