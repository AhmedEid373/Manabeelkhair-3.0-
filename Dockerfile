# ── Stage 1: Build React app ──────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Runtime (Node only) ─────────────────────────────────────────
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy built React assets
COPY --from=build /app/dist ./dist

# Install only production server dependencies
COPY server/package.json ./server/
RUN cd server && npm install --omit=dev

# Copy server source
COPY server/ ./server/

EXPOSE 3001

CMD ["node", "server/index.js"]
