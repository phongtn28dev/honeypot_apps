#!/bin/sh
set -e

# Step 1: Create valid .npmrc
echo "$NPM_RC" > .npmrc
echo "[INFO] .npmrc created."

echo "=== Current .npmrc ==="
cat .npmrc

# Force pnpm to use this .npmrc explicitly
export NPM_CONFIG_USERCONFIG="$(pwd)/.npmrc"

# Step 2: Install dependencies
pnpm install

# Step 3: Determine app to build
if [ -z "$NX_APP" ]; then
  echo "❌ NX_APP environment variable not set!"
  exit 1
fi

echo "[INFO] Building Nx app: $NX_APP"
pnpm nx build "$NX_APP" --prod
