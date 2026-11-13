FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
# better-sqlite3 has no musl prebuilt binary; node-gyp needs a toolchain
RUN apk add --no-cache python3 make g++

# Copy all source files
COPY . .

# Install dependencies (includes devDependencies for seed/certification commands)
RUN pnpm install --frozen-lockfile=true

# Build API and its dependencies (copies canonical seed artifacts to dist/data)
RUN pnpm run build --filter=api...

ENV API_PORT=4000
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"
EXPOSE 4000

# Start API server
CMD ["pnpm", "--filter=api", "start"]
