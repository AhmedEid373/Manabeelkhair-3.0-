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
NODE_ENV=production node /app/server/index.js &
NODE_PID=$!

echo "Waiting for API server to be ready on port 3001..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:3001/api/health > /dev/null 2>&1; then
    echo "API server is ready!"
    break
  fi
  if ! kill -0 $NODE_PID 2>/dev/null; then
    echo "ERROR: API server process died!"
    exit 1
  fi
  echo "API server not ready yet... retrying ($i/30)"
  sleep 1
done

echo "Starting Nginx..."
nginx -g 'daemon off;'
