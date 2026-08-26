import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: ['packages/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@moon/orm': path.resolve(__dirname, 'packages/moon-orm/src/index.ts'),
      '@moon/base': path.resolve(__dirname, 'packages/moon-base/src/index.ts'),
      '@moon/mail': path.resolve(__dirname, 'packages/moon-mail/src/index.ts'),
      '@moon/product': path.resolve(__dirname, 'packages/moon-product/src/index.ts'),
      '@moon/account': path.resolve(__dirname, 'packages/moon-account/src/index.ts'),
      '@moon/stock': path.resolve(__dirname, 'packages/moon-stock/src/index.ts'),
      '@moon/crm': path.resolve(__dirname, 'packages/moon-crm/src/index.ts'),
      '@moon/geo': path.resolve(__dirname, 'packages/moon-geo/src/index.ts'),
      '@moon/server': path.resolve(__dirname, 'packages/moon-server/src/index.ts'),
    }
  }
})
