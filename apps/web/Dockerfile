FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy all source files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile=false

# Set environment variables for Next.js build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Web and its dependencies
RUN pnpm run build --filter=web...

# Move standalone output to working directory (if needed) or run directly
# Since we are using turbo, the standalone output is at apps/web/.next/standalone
# but it requires public/ and .next/static/ copied over.
# For simplicity with Turbo and Standalone, we just run the server.js in standalone

ENV WEB_PORT=3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "apps/web/.next/standalone/apps/web/server.js"]
