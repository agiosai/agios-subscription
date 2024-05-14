FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN chown -R nodejs:nodejs /app
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

FROM node:22-alpine AS runner
RUN corepack enable pnpm
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
RUN ls -al /app
USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
