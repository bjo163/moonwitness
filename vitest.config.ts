import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts', 'apps/**/*.test.ts', 'cli/**/*.test.ts', 'scripts/**/*.test.mjs'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@moon/orm/dist/registry.js': path.resolve(__dirname, 'packages/moon-orm/src/registry.ts'),
      '@moon/orm': path.resolve(__dirname, 'packages/moon-orm/src/index.ts'),
      '@moon/server/dist/router.js': path.resolve(__dirname, 'packages/moon-server/src/router.ts'),
      '@moon/base': path.resolve(__dirname, 'packages/moon-base/src/index.ts'),
      '@moon/witness/dist/astronomy/prayer-times.js': path.resolve(__dirname, 'packages/moon-witness/src/astronomy/prayer-times.ts'),
      '@moon/witness/dist/astronomy/moon-phase.js': path.resolve(__dirname, 'packages/moon-witness/src/astronomy/moon-phase.ts'),
      '@moon/mail': path.resolve(__dirname, 'packages/moon-mail/src/index.ts'),
      '@moon/product': path.resolve(__dirname, 'packages/moon-product/src/index.ts'),
      '@moon/account': path.resolve(__dirname, 'packages/moon-account/src/index.ts'),
      '@moon/stock': path.resolve(__dirname, 'packages/moon-stock/src/index.ts'),
      '@moon/crm': path.resolve(__dirname, 'packages/moon-crm/src/index.ts'),
      '@moon/geo': path.resolve(__dirname, 'packages/moon-geo/src/index.ts'),
      '@moon/server': path.resolve(__dirname, 'packages/moon-server/src/index.ts'),
      '@moon/protocol': path.resolve(__dirname, 'packages/moon-protocol/src/index.ts'),
      '@moon/compute': path.resolve(__dirname, 'packages/moon-compute/src/index.ts'),
      '@moon/witness': path.resolve(__dirname, 'packages/moon-witness/src/index.ts'),
      '@moon/mizan': path.resolve(__dirname, 'packages/moon-mizan/src/index.ts'),
      '@moon/client': path.resolve(__dirname, 'packages/moon-client/src/index.ts'),
      '@workspace/error': path.resolve(__dirname, 'packages/error/src/index.ts'),
      '@workspace/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
    }
  }
})
