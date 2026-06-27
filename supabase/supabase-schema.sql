create table if not exists public.rooms (
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

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  room_type text not null check (room_type in ('Single-bedroom', 'Double-bedroom', 'Triple-bedroom', 'Wedding/Events/Celebrations')),
  room_amount numeric not null,
  check_in date not null,
  check_out date not null,
  nights integer not null default 1,
  adults integer not null,
  children integer not null default 0,
  total_amount numeric,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'failed')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  source text not null default 'website' check (source in ('website', 'admin', 'phone', 'walk_in')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_created_at on public.bookings (created_at desc);

alter table if exists public.bookings
  add column if not exists room_type text;

alter table if exists public.bookings
  add column if not exists room_amount numeric default 6000;

alter table if exists public.bookings
  add column if not exists nights integer default 1;

alter table if exists public.bookings
  add column if not exists total_amount numeric default 0;

alter table if exists public.bookings
  add column if not exists payment_status text default 'pending';

alter table if exists public.bookings
  add column if not exists source text default 'website';

alter table if exists public.bookings
  add column if not exists notes text;