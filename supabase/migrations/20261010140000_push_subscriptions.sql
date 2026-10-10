create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  endpoint text not null unique check (endpoint like 'https://%' or endpoint like 'http://%'),
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "admins manage their push subscriptions" on public.push_subscriptions
  for all to authenticated
  using ((select public.is_admin()) and user_id = (select auth.uid()))
  with check ((select public.is_admin()) and user_id = (select auth.uid()));

revoke all on public.push_subscriptions from anon;
