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
  transpilePackages: ["@workspace/ui", "@moon/witness", "@moon/time"],

  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: false,
  cacheComponents: false,
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: http:; worker-src 'self' blob:",
          },
        ],
      },
    ]
  },
  serverExternalPackages: [
    "knex",
    "@moon/orm",
    "@moon/server",
    "@moon/khidra",
    "better-sqlite3",
    "pg",
    "oracledb",
    "mariadb",
  ],
  webpack: (config) => {
    config.externals.push(
      "knex",
      "@moon/orm",
      "@moon/server",
      "@moon/khidra",
      "oracledb",
      "mariadb/callback"
    )
    return config
  },
  turbopack: {},
}

export default withSerwist(nextConfig)
