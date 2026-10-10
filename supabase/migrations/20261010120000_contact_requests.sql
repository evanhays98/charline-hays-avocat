alter table public.bookings drop constraint bookings_no_overlap;

alter table public.bookings
  alter column starts_at drop not null,
  alter column ends_at drop not null,
  add column availability text[] not null default '{}' check (cardinality(availability) <= 30),
  add constraint bookings_confirmed_has_time check (status <> 'confirmed' or (starts_at is not null and ends_at is not null)),
  add constraint bookings_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status = 'confirmed');

create index bookings_created_at_idx on public.bookings (created_at desc);

create or replace function public.free_slots(range_start date, range_end date)
returns table (starts_at timestamptz, ends_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  with config as (
    select settings.slot_minutes, settings.timezone
    from public.settings
    where settings.id
  ),
  days as (
    select day::date as day, config.slot_minutes, config.timezone
    from config,
      generate_series(range_start, least(range_end, range_start + 62), interval '1 day') as day
  ),
  candidates as (
    select
      (local_start at time zone days.timezone) as slot_start,
      ((local_start + make_interval(mins => days.slot_minutes)) at time zone days.timezone) as slot_end
    from days
    join public.weekly_hours hours on hours.weekday = extract(isodow from days.day)
    cross join lateral generate_series(
      days.day + hours.starts_at,
      days.day + hours.ends_at - make_interval(mins => days.slot_minutes),
      make_interval(mins => days.slot_minutes)
    ) as local_start
  )
  select distinct candidates.slot_start, candidates.slot_end
  from candidates
  where candidates.slot_start > now()
    and not exists (
      select 1 from public.time_off
      where tstzrange(time_off.starts_at, time_off.ends_at) && tstzrange(candidates.slot_start, candidates.slot_end)
    )
    and not exists (
      select 1 from public.bookings
      where bookings.status = 'confirmed'
        and tstzrange(bookings.starts_at, bookings.ends_at) && tstzrange(candidates.slot_start, candidates.slot_end)
    )
  order by candidates.slot_start;
end;
$$;

revoke execute on function public.free_slots(date, date) from public, anon;
grant execute on function public.free_slots(date, date) to authenticated;

drop function public.available_slots(date, date);

create function public.ping()
returns boolean
language sql
stable
as $$ select true $$;

grant execute on function public.ping() to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;
