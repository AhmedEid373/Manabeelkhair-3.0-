#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
# Wait up to 60 seconds for MySQL
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

# Run seed to ensure tables exist
echo "Running database seed..."
node /app/server/seed.js || echo "Seed warning: tables may already exist"

# Start Node API server in background
echo "Starting API server..."
NODE_ENV=production node /app/server/index.js &

# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
