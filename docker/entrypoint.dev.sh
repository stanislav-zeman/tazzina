#!/bin/sh
set -e

echo "==> Running migrations..."
pnpm migrate

echo "==> Starting Vite dev server..."
exec pnpm exec vite dev --host 0.0.0.0
