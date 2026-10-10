alter table public.settings
  add column calendar_token text not null default encode(extensions.gen_random_bytes(24), 'hex');

create function public.regenerate_calendar_token()
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  token text := encode(extensions.gen_random_bytes(24), 'hex');
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update public.settings set calendar_token = token where id;
  return token;
end;
$$;

revoke execute on function public.regenerate_calendar_token() from public, anon;
grant execute on function public.regenerate_calendar_token() to authenticated;
