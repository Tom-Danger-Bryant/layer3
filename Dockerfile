FROM node:18-alpine as base

FROM base as builder
WORKDIR /app

RUN npm i -g pnpm@9

COPY . .

RUN pnpm i --frozen-lockfile
RUN pnpm run prisma:generate
RUN pnpm run prisma:migrate

RUN pnpm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js
