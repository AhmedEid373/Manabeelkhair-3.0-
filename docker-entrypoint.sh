#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
for i in $(seq 1 30); do
  if node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect().then(() => { client.end(); process.exit(0); }).catch(() => process.exit(1));
  " 2>/dev/null; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo "PostgreSQL not ready yet... retrying ($i/30)"
  sleep 2
done

echo "Running database seed..."
node /app/server/seed.js

echo "Starting API server..."
NODE_ENV=production exec node /app/server/index.js
