import type { NextConfig } from "next"
import withSerwistInit from "@serwist/next"

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
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  turbopack: {},
}

export default withSerwist(nextConfig)
