#!/bin/sh

echo "//npm.pkg.github.com/:_authToken=${UNIVERSAL_ACCOUNT_GITHUB_TOKEN}" > .npmrc

# continue with build
pnpm install
pnpm build
