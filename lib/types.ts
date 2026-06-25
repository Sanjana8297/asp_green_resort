export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  category: 'villa' | 'container' | 'wooden' | 'conventional';
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  room_type: string;
  room_amount: number;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded' | 'failed';
  source?: 'website' | 'admin' | 'phone' | 'walk_in';
  total_amount?: number;
  notes?: string | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at?: string;
}