#!/usr/bin/env sh
# Reference sprites (vanilla OSRS UI) used to regenerate assets. Never committed or published.
set -e
cd "$(dirname "$0")/.."
if [ -d reference/vanilla/.git ]; then git -C reference/vanilla pull -q; else
  git clone -q --depth 1 -b sample-vanilla https://github.com/melkypie/resource-packs.git reference/vanilla
fi
echo "reference sprites in reference/vanilla"
