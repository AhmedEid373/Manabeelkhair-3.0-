# ── Stage 1: Build React app ──────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Runtime (Nginx + Node API) ──────────────────────────────────
FROM node:18-alpine AS runtime

# Install Nginx
RUN apk add --no-cache nginx

# Copy built React assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Install only production server dependencies
WORKDIR /app/server
COPY server/package.json ./
RUN npm install --omit=dev
COPY server/ ./

# Startup script: run both Node API and Nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
CMD ["/docker-entrypoint.sh"]
