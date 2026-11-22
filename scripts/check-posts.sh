#!/usr/bin/env bash
# Fails the build when a published post is missing required fields
# or links to anything other than an official, HTTPS source.
set -euo pipefail
shopt -s nullglob

allowed='^(nvd\.nist\.gov|www\.cve\.org|cve\.org|osv\.dev|www\.cisa\.gov|github\.com|msrc\.microsoft\.com|learn\.microsoft\.com|security-tracker\.debian\.org|www\.debian\.org|ubuntu\.com|www\.ubuntu\.com|access\.redhat\.com|nodejs\.org|www\.php\.net|php\.net|www\.openssh\.com|openssh\.com|alpinelinux\.org|security\.alpinelinux\.org|www\.openwall\.com|openwall\.com|pypi\.org|www\.npmjs\.com)$'
fail=0

for f in content/posts/*.md; do
  [ "$(basename "$f")" = "_index.md" ] && continue
  fm=$(awk 'NR==1 && /^---$/ {inside=1; next} inside && /^---$/ {exit} inside {print}' "$f")

  if grep -qE '^draft:[[:space:]]*true' <<<"$fm"; then continue; fi

  for key in title date cve cvss ecosystem sources ai_generated; do
    grep -qE "^${key}:" <<<"$fm" || { echo "::error file=$f::missing '$key' in front matter"; fail=1; }
  done
  grep -qE '^ai_generated:[[:space:]]*true' <<<"$fm" || { echo "::error file=$f::ai_generated must be true"; fail=1; }
  grep -qE '^cve:[[:space:]]*"?CVE-[0-9]{4}-[0-9]{4,}"?' <<<"$fm" || { echo "::error file=$f::cve must look like CVE-YYYY-NNNN"; fail=1; }
  grep -qE '^ecosystem:[[:space:]]*"?(windows|linux|php|npm|python)"?' <<<"$fm" || { echo "::error file=$f::ecosystem must be windows, linux, php, npm or python"; fail=1; }

  urls=$(grep -oE 'https?://[^ "'"'"')>]+' "$f" || true)
  [ -n "$urls" ] || { echo "::error file=$f::no source links"; fail=1; }
  while read -r u; do
    [ -z "$u" ] && continue
    if [[ "$u" != https://* ]]; then echo "::error file=$f::link is not HTTPS: $u"; fail=1; continue; fi
    host=$(sed -E 's#^https://([^/:]+).*#\1#' <<<"$u")
    [[ "$host" =~ $allowed ]] || { echo "::error file=$f::link to a non-official domain: $host"; fail=1; }
  done <<<"$urls"
done

exit "$fail"
