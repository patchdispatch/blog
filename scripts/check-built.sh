#!/usr/bin/env bash
# Checks the built site: every post carries the AI notice, required files exist.
set -euo pipefail
shopt -s nullglob globstar
fail=0

for f in public/20*/**/index.html; do
  grep -q 'ai-notice' "$f" || { echo "::error::$f has no AI notice"; fail=1; }
done

ls public/css/site.*.css >/dev/null 2>&1 || { echo "::error::fingerprinted CSS missing"; fail=1; }
ls public/js/search.*.js >/dev/null 2>&1 || { echo "::error::fingerprinted search script missing"; fail=1; }
for required in index.html index.json posts/index.html 404.html .well-known/security.txt robots.txt; do
  [ -f "public/$required" ] || { echo "::error::public/$required is missing"; fail=1; }
done

exit "$fail"
