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
    matcher: ({ url }) => url.pathname.startsWith("/api/scriptures") || url.pathname.startsWith("/api/witness"),
    handler: new StaleWhileRevalidate({
      cacheName: "quran-witness-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  },
  {
    matcher: ({ url }) => url.pathname.startsWith("/api/hadiths"),
    handler: new StaleWhileRevalidate({
      cacheName: "hadiths-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 300,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  },
  {
    matcher: ({ url }) =>
      url.pathname.startsWith("/api/prayer-times") ||
      url.pathname.startsWith("/api/services/celestial") ||
      url.pathname.startsWith("/api/islamic"),
    handler: new StaleWhileRevalidate({
      cacheName: "celestial-prayer-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    }),
  },
  {
    matcher: ({ url }) =>
      url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
    handler: new CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
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
