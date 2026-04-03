# ── Stage 1: Build Frontend ────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build Backend ─────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --silent
COPY backend/ ./
RUN npm run build

# ── Stage 3: Production Image ──────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install only production backend dependencies
COPY backend/package*.json ./
RUN npm ci --only=production --silent

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./dist

# Serve frontend from backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
