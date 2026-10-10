create extension if not exists btree_gist with schema extensions;

create type public.booking_status as enum ('pending', 'confirmed', 'declined', 'cancelled');

create type public.consultation_format as enum ('cabinet', 'visio', 'telephone');

create table public.settings (
  id boolean primary key default true check (id),
  slot_minutes integer not null default 60 check (slot_minutes between 15 and 240),
  min_notice_hours integer not null default 24 check (min_notice_hours between 0 and 720),
  horizon_days integer not null default 28 check (horizon_days between 1 and 120),
  timezone text not null default 'Europe/Paris'
);

insert into public.settings default values;

create table public.weekly_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 1 and 7),
  starts_at time not null,
  ends_at time not null,
  check (ends_at > starts_at)
);

insert into public.weekly_hours (weekday, starts_at, ends_at)
select weekday, period.starts_at, period.ends_at
from generate_series(1, 5) as weekday
cross join (values (time '09:00', time '12:00'), (time '14:00', time '18:00')) as period (starts_at, ends_at);

create table public.time_off (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  label text check (char_length(label) <= 120),
  check (ends_at > starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'pending',
  subject text not null check (
    subject in ('divorce', 'enfants', 'pension', 'patrimoine', 'filiation', 'penal', 'etranger', 'autre')
  ),
  format public.consultation_format not null default 'cabinet',
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' and char_length(email) <= 254),
  phone text check (char_length(phone) <= 30),
  message text check (char_length(message) <= 1000),
  check (ends_at > starts_at),
  constraint bookings_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending', 'confirmed'))
);

create index bookings_starts_at_idx on public.bookings (starts_at);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

alter table public.settings enable row level security;
alter table public.weekly_hours enable row level security;
alter table public.time_off enable row level security;
alter table public.bookings enable row level security;
alter table public.admins enable row level security;

create policy "admins manage settings" on public.settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage weekly hours" on public.weekly_hours
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage time off" on public.time_off
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins manage bookings" on public.bookings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins read admins" on public.admins
  for select to authenticated using ((select public.is_admin()));

revoke all on public.settings, public.weekly_hours, public.time_off, public.bookings, public.admins from anon;

create function public.available_slots(range_start date, range_end date)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  with config as (
    select
      settings.*,
      (now() at time zone settings.timezone)::date as today
    from public.settings
    where settings.id
  ),
  days as (
    select day::date as day, config.*
    from config,
      generate_series(
        greatest(range_start, config.today),
        least(range_end, config.today + config.horizon_days, greatest(range_start, config.today) + 62),
        interval '1 day'
      ) as day
  ),
  candidates as (
    select
      (local_start at time zone days.timezone) as starts_at,
      ((local_start + make_interval(mins => days.slot_minutes)) at time zone days.timezone) as ends_at,
      days.min_notice_hours
    from days
    join public.weekly_hours hours on hours.weekday = extract(isodow from days.day)
    cross join lateral generate_series(
      days.day + hours.starts_at,
      days.day + hours.ends_at - make_interval(mins => days.slot_minutes),
      make_interval(mins => days.slot_minutes)
    ) as local_start
  )
  select distinct candidates.starts_at, candidates.ends_at
  from candidates
  where candidates.starts_at >= now() + make_interval(hours => candidates.min_notice_hours)
    and not exists (
      select 1 from public.time_off
      where tstzrange(time_off.starts_at, time_off.ends_at) && tstzrange(candidates.starts_at, candidates.ends_at)
    )
    and not exists (
      select 1 from public.bookings
      where bookings.status in ('pending', 'confirmed')
        and tstzrange(bookings.starts_at, bookings.ends_at) && tstzrange(candidates.starts_at, candidates.ends_at)
    )
  order by candidates.starts_at;
$$;

revoke execute on function public.available_slots(date, date) from public;
grant execute on function public.available_slots(date, date) to anon, authenticated, service_role;
