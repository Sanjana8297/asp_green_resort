-- Prevent overlapping active bookings at database level.
-- Run this file in Supabase SQL Editor.

begin;

-- Needed so text can participate in GiST exclusion constraints.
create extension if not exists btree_gist;

-- Ensure required columns exist for date-range protection.
alter table if exists public.bookings
  add column if not exists check_in date;

alter table if exists public.bookings
  add column if not exists check_out date;

alter table if exists public.bookings
  add column if not exists status text default 'pending';

-- Safety check: check-out must be after check-in.
alter table if exists public.bookings
  drop constraint if exists bookings_valid_date_range;

alter table if exists public.bookings
  add constraint bookings_valid_date_range
  check (check_out > check_in);

-- Exclusion constraint blocks overlap for non-cancelled bookings.
-- Overlap rule: [check_in, check_out) && [check_in, check_out)
alter table if exists public.bookings
  drop constraint if exists bookings_no_date_overlap;

alter table public.bookings
  add constraint bookings_no_date_overlap
  exclude using gist (
    daterange(check_in, check_out, '[)') with &&
  )
  where (status <> 'cancelled');

commit;
