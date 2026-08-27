# ◈ MOONWITNESS OS V9.0 — MULTI-STAGE ENTERPRISE DOCKERFILE
# Stage 1: Base Environment
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Stage 2: Pruning Monorepo with Turbo
FROM base AS pruner
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=api --scope=command-center --scope=web --docker

# Stage 3: Dependency Installation & Compilation
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build

# Stage 4: Production Runtime Image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app .

EXPOSE 3000 3001 4000

CMD ["node", "apps/api/dist/server.js"]
