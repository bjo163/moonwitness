# ◈ MOONWITNESS OS — WEB PORTALS PRODUCTION IMAGE
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app

FROM base AS pruner
RUN npm install -g turbo@2.9.18
COPY . .
RUN turbo prune --scope=command-center --scope=web --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.json ./tsconfig.json
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm turbo build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .

EXPOSE 3000 3001
CMD ["pnpm", "--filter", "web", "start"]
