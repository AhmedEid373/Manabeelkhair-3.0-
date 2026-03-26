# ── Stage 1: Build React app ──────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Runtime (Node API) ───────────────────────────────────────────
FROM node:18-alpine AS runtime

RUN apk add --no-cache curl

# Install only production server dependencies
WORKDIR /app/server
COPY server/package.json ./
RUN npm install --omit=dev
COPY server/ ./

# Copy built React assets for Express to serve
COPY --from=build /app/dist /app/dist

# Startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001
CMD ["/docker-entrypoint.sh"]
