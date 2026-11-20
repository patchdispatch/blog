#!/usr/bin/env bash
# Installs a pinned Hugo extended release and verifies its checksum.
set -euo pipefail
: "${HUGO_VERSION:?set HUGO_VERSION}"
base="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}"
file="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
cd "$(mktemp -d)"
curl -sSfLO "${base}/${file}"
curl -sSfL -o checksums.txt "${base}/hugo_${HUGO_VERSION}_checksums.txt"
grep " ${file}$" checksums.txt | sha256sum -c -
mkdir -p "$HOME/.local/bin"
tar -xzf "$file" -C "$HOME/.local/bin" hugo
"$HOME/.local/bin/hugo" version
