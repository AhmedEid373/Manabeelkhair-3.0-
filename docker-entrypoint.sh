#!/bin/sh
set -e

# Start Node API server in background
NODE_ENV=production node /app/server/index.js &

# Start Nginx in foreground
nginx -g 'daemon off;'
