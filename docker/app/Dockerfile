# BUILD
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

## 1. Install dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN rm -rf .next/cache

## 2. Define build variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_DISABLE_ESLINT=true

# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm build

# RUN
FROM node:20-alpine AS runner

WORKDIR /app

## 3. Set production environments
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

## 4. Copy essential files from build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
