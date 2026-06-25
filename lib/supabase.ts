/*
SQL schema notes for Supabase:

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price_per_night numeric not null,
  max_guests integer not null,
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  category text not null check (category in ('villa', 'container', 'wooden', 'conventional')),
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  room_type text not null check (room_type in ('Single-bedroom', 'Double-bedroom', 'Triple-bedroom')),
  room_amount numeric not null,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  adults integer not null,
  children integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  source text not null default 'website' check (source in ('website', 'admin', 'phone', 'walk_in')),
  total_amount numeric,
  notes text,
  created_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  review text not null,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key';

export const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});