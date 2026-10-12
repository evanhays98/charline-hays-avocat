#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

host="www.haysavocat.fr"
key_file=$(ls public | grep -E '^[0-9a-f]{32}\.txt$' | head -n 1)
key="${key_file%.txt}"
urls=$(curl -fsS "https://${host}/sitemap.xml" | sed -n 's|.*<loc>\(.*\)</loc>.*|"\1"|p' | paste -sd, -)

curl -sS -o /dev/null -w 'IndexNow : HTTP %{http_code}\n' -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"${host}\",\"key\":\"${key}\",\"keyLocation\":\"https://${host}/${key_file}\",\"urlList\":[${urls}]}"
