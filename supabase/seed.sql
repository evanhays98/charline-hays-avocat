insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'dev@local.test',
  extensions.crypt('dev-local-123', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  '', '', '', ''
);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  gen_random_uuid(),
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"dev@local.test","email_verified":true}',
  'email',
  now(), now(), now()
);

insert into public.admins (user_id) values ('00000000-0000-4000-8000-000000000001');

with next_days as (
  select
    (current_date + offset_days)::date as day,
    row_number() over (order by offset_days) as position
  from generate_series(1, 14) as offset_days
  where extract(isodow from current_date + offset_days) < 6
)
insert into public.bookings (created_at, subject, format, full_name, email, phone, message, availability)
select
  now() - interval '2 hours',
  'divorce', 'cabinet'::public.consultation_format, 'Claire Martin', 'claire.martin@exemple.fr', '06 12 34 56 78',
  'Nous sommes mariés depuis 12 ans, deux enfants. Mon mari souhaite divorcer.',
  array[
    (select day from next_days where position = 1)::text || '|matin',
    (select day from next_days where position = 2)::text || '|apres-midi'
  ]
union all
select
  now() - interval '1 day',
  'enfants', 'visio'::public.consultation_format, 'Paul Durand', 'paul.durand@exemple.fr', null,
  null,
  array[(select day from next_days where position = 3)::text || '|matin']
union all
select
  now() - interval '3 days',
  'pension', 'telephone'::public.consultation_format, 'Sophie Bernard', 'sophie.bernard@exemple.fr', '07 11 22 33 44',
  'Révision de la pension alimentaire.',
  '{}'::text[];

insert into public.bookings (created_at, status, starts_at, ends_at, subject, format, full_name, email, phone)
select
  now() - interval '5 days',
  'confirmed'::public.booking_status,
  ((current_date + 2)::timestamp + time '10:00') at time zone 'Europe/Paris',
  ((current_date + 2)::timestamp + time '11:00') at time zone 'Europe/Paris',
  'patrimoine', 'cabinet'::public.consultation_format, 'Julien Petit', 'julien.petit@exemple.fr', '06 98 76 54 32';

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000002',
  'authenticated',
  'authenticated',
  'charlinehays.avocat@gmail.com',
  extensions.crypt('dev-local-123', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  '', '', '', ''
);

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
  gen_random_uuid(),
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000002',
  '{"sub":"00000000-0000-4000-8000-000000000002","email":"charlinehays.avocat@gmail.com","email_verified":true}',
  'email',
  now(), now(), now()
);

insert into public.admins (user_id) values ('00000000-0000-4000-8000-000000000002');
