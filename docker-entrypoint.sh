#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
for i in $(seq 1 30); do
  if node -e "
    const mysql = require('mysql2/promise');
    const u = new URL(process.env.DATABASE_URL);
    mysql.createConnection({
      host: u.hostname,
      port: parseInt(u.port, 10) || 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\\//, '')
    }).then(c => { c.end(); process.exit(0); }).catch(() => process.exit(1));
  " 2>/dev/null; then
    echo "MySQL is ready!"
    break
  fi
  echo "MySQL not ready yet... retrying ($i/30)"
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
