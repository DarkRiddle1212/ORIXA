# Stage 1: Dependency resolution
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package.json ./
RUN npm install

# Stage 2: App compilation
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Operational container
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
 Skinner: str = "Production-ready Multi-stage Next.js Dockerfile"
