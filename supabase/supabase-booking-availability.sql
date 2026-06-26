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

create or replace function public.bookings_validate_package_conflict()
returns trigger as $$
begin
  if (new.status = 'cancelled') then
    return new;
  end if;

  if (new.check_out <= new.check_in) then
    raise exception 'Check-out date must be after check-in date.';
  end if;

  if (new.room_type = 'Triple-bedroom') then
    if exists (
      select 1 from public.bookings b
      where (new.id is null or b.id <> new.id)
        and b.status <> 'cancelled'
        and daterange(b.check_in, b.check_out, '[)') && daterange(new.check_in, new.check_out, '[)')
        and b.room_type in ('Single-bedroom', 'Double-bedroom', 'Triple-bedroom')
    ) then
      raise exception 'Choose another date because single or double bedroom packages are already booked for this date.';
    end if;
  else
    if exists (
      select 1 from public.bookings b
      where (new.id is null or b.id <> new.id)
        and b.status <> 'cancelled'
        and daterange(b.check_in, b.check_out, '[)') && daterange(new.check_in, new.check_out, '[)')
        and b.room_type = 'Triple-bedroom'
    ) then
      raise exception 'Choose another date because the triple bedroom package is already booked for this date.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger bookings_validate_package_conflict
  before insert or update on public.bookings
  for each row execute function public.bookings_validate_package_conflict();

commit;
