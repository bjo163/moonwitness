import { defaultCache } from "@serwist/next/worker"
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  RuntimeCaching,
} from "serwist"
import {
  Serwist,
  CacheFirst,
  ExpirationPlugin,
  StaleWhileRevalidate,
} from "serwist"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: WorkerGlobalScope

const customCache: RuntimeCaching[] = [
  {
    matcher: ({ url }) => url.pathname.startsWith("/api/scriptures"),
    handler: new StaleWhileRevalidate({
      cacheName: "quran-scriptures-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  },
  ...defaultCache,
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customCache,
})

serwist.addEventListeners()
