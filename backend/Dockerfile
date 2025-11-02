# Use Node.js 20 LTS with Debian Bookworm (includes OpenSSL 3.0)
FROM node:20-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Install required system dependencies for onnxruntime-node and Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    wget \
    libstdc++6 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/microsoft/onnxruntime/releases/download/v1.14.0/onnxruntime-linux-x64-1.14.0.tgz \
    && tar -xzf onnxruntime-linux-x64-1.14.0.tgz \
    && cp onnxruntime-linux-x64-1.14.0/lib/libonnxruntime.so* /usr/lib/ \
    && rm -rf onnxruntime-linux-x64-1.14.0*
    
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install required system dependencies in the runner stage
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    wget \
    libstdc++6 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install ONNX Runtime in the runner stage
RUN wget https://github.com/microsoft/onnxruntime/releases/download/v1.14.0/onnxruntime-linux-x64-1.14.0.tgz \
    && tar -xzf onnxruntime-linux-x64-1.14.0.tgz \
    && cp onnxruntime-linux-x64-1.14.0/lib/libonnxruntime.so* /usr/lib/ \
    && rm -rf onnxruntime-linux-x64-1.14.0*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create and set permissions for transformers cache directory
RUN mkdir -p /app/node_modules/@xenova/transformers/.cache && \
    chown -R nextjs:nodejs /app/node_modules/@xenova && \
    chmod -R 755 /app/node_modules/@xenova

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
