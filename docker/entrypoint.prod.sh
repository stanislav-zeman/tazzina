#!/bin/sh
set -e

echo "==> Running migrations..."
pnpm migrate

echo "==> Starting production server..."
exec node build
