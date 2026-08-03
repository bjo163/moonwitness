import type { NextConfig } from "next"
import withSerwistInit from "@serwist/next"

if (process.env.WEB_PORT) {
  process.env.PORT = process.env.WEB_PORT
}

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/quran-core"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: false,
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  turbopack: {},
}

export default withSerwist(nextConfig)
