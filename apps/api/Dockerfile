FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

# Copy all source files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile=true

# Build API and its dependencies
RUN pnpm run build --filter=api...

# Default API port
ENV API_PORT=4000
EXPOSE ${API_PORT}

# Start API
CMD ["pnpm", "--filter", "api", "run", "start"]
