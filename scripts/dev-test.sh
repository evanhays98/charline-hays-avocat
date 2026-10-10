#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

supabase() { npx --yes supabase@2.120.0 "$@"; }

supabase start -x vector,logflare,imgproxy,supavisor,realtime
local_secret=$(supabase status -o env 2>/dev/null | sed -n 's/^SECRET_KEY="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p')
curl -s -o /dev/null -X POST "http://127.0.0.1:54321/storage/v1/object/public-assets/logo-email.png" \
  -H "apikey: ${local_secret}" -H "Authorization: Bearer ${local_secret}" \
  -H "Content-Type: image/png" -H "x-upsert: true" \
  --data-binary @supabase/assets/logo-email.png || true

supabase functions serve > supabase-functions.log 2>&1 &
functions_pid=$!
trap 'kill "$functions_pid" 2>/dev/null || true' EXIT INT TERM

printf '\n  Site            http://localhost:3000\n'
printf '  Admin de test   http://localhost:3000/admin  (dev@local.test ou charlinehays.avocat@gmail.com / dev-local-123)\n'
printf '  Emails de test  http://127.0.0.1:54324  (Mailpit, rien ne part sur Internet)\n'
printf '  Base de données http://127.0.0.1:54323  (Supabase Studio)\n\n'

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH \
  npm run dev
