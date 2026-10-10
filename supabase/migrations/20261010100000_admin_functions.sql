create function public.replace_weekly_hours(hours jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  delete from public.weekly_hours where true;
  insert into public.weekly_hours (weekday, starts_at, ends_at)
  select item.weekday, item.starts_at, item.ends_at
  from jsonb_to_recordset(hours) as item (weekday smallint, starts_at time, ends_at time);
end;
$$;

create function public.add_time_off(
  first_day date,
  last_day date,
  from_time time default null,
  to_time time default null,
  label text default null
)
returns public.time_off
language plpgsql
security invoker
set search_path = ''
as $$
declare
  zone text := (select settings.timezone from public.settings where settings.id);
  created public.time_off;
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  insert into public.time_off (starts_at, ends_at, label)
  values (
    (first_day + coalesce(from_time, time '00:00')) at time zone zone,
    case
      when to_time is null then ((last_day + 1)::timestamp at time zone zone)
      else ((last_day + to_time) at time zone zone)
    end,
    nullif(trim(label), '')
  )
  returning * into created;
  return created;
end;
$$;

revoke execute on function public.replace_weekly_hours(jsonb) from public, anon;
revoke execute on function public.add_time_off(date, date, time, time, text) from public, anon;
grant execute on function public.replace_weekly_hours(jsonb) to authenticated;
grant execute on function public.add_time_off(date, date, time, time, text) to authenticated;
