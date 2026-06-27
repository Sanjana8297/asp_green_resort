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

-- Remove the broad overlap exclusion constraint and replace it with package-aware booking validation.
alter table if exists public.bookings
  drop constraint if exists bookings_no_date_overlap;

-- Allow the Wedding/Events/Celebrations package as a valid room type.
alter table if exists public.bookings
  drop constraint if exists bookings_room_type_check;

alter table if exists public.bookings
  add constraint bookings_room_type_check
  check (room_type in ('Single-bedroom', 'Double-bedroom', 'Triple-bedroom', 'Wedding/Events/Celebrations'));

create or replace function public.bookings_validate_package_conflict()
returns trigger as $$
begin
  if (new.status = 'cancelled') then
    return new;
  end if;

  if (new.check_out <= new.check_in) then
    raise exception 'Check-out date must be after check-in date.';
  end if;

  -- Triple-bedroom and Wedding/Events/Celebrations are whole-venue bookings: they conflict with any other active booking.
  if (new.room_type in ('Triple-bedroom', 'Wedding/Events/Celebrations')) then
    if exists (
      select 1 from public.bookings b
      where (new.id is null or b.id <> new.id)
        and b.status <> 'cancelled'
        and daterange(b.check_in, b.check_out, '[)') && daterange(new.check_in, new.check_out, '[)')
    ) then
      raise exception 'Choose another date because the venue is already booked for this date.';
    end if;
  else
    if exists (
      select 1 from public.bookings b
      where (new.id is null or b.id <> new.id)
        and b.status <> 'cancelled'
        and daterange(b.check_in, b.check_out, '[)') && daterange(new.check_in, new.check_out, '[)')
        and b.room_type in ('Triple-bedroom', 'Wedding/Events/Celebrations', new.room_type)
    ) then
      raise exception 'Choose another date because this package is already booked for this date.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger bookings_validate_package_conflict
  before insert or update on public.bookings
  for each row execute function public.bookings_validate_package_conflict();

commit;

-- Atomic insert function: inserts a booking only if no conflicting booking exists.
create or replace function public.create_booking_if_available(
  p_full_name text,
  p_phone text,
  p_email text,
  p_room_type text,
  p_room_amount numeric,
  p_check_in date,
  p_check_out date,
  p_nights integer,
  p_adults integer,
  p_children integer,
  p_total_amount numeric,
  p_payment_status text default 'pending',
  p_status text default 'pending',
  p_source text default 'website',
  p_notes text default null
)
returns uuid as $$
declare
  v_id uuid;
begin
  if p_check_out <= p_check_in then
    raise exception 'Check-out date must be after check-in date.';
  end if;

  if exists (
    select 1 from public.bookings b
    where b.status <> 'cancelled'
      and daterange(b.check_in, b.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
      and (
        p_room_type in ('Triple-bedroom', 'Wedding/Events/Celebrations')
        or b.room_type in ('Triple-bedroom', 'Wedding/Events/Celebrations')
        or b.room_type = p_room_type
      )
  ) then
    if p_room_type in ('Triple-bedroom', 'Wedding/Events/Celebrations') then
      raise exception 'Choose another date because the venue is already booked for this date.';
    else
      raise exception 'Choose another date because this package is already booked for this date.';
    end if;
  end if;

  insert into public.bookings(full_name, phone, email, room_type, room_amount, check_in, check_out, nights, adults, children, total_amount, payment_status, status, source, notes)
  values (p_full_name, p_phone, p_email, p_room_type, p_room_amount, p_check_in, p_check_out, p_nights, p_adults, p_children, p_total_amount, p_payment_status, p_status, p_source, p_notes)
  returning id into v_id;

  return v_id;
end;
$$ language plpgsql security definer;
