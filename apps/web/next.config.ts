import type { NextConfig } from "next"
import path from "path"
import withSerwistInit from "@serwist/next"
// @ts-ignore
import webpack from "webpack"

if (process.env.WEB_PORT) {
  process.env.PORT = process.env.WEB_PORT
}
if (!process.env.NODE_OPTIONS?.includes("--no-deprecation")) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} --no-deprecation`.trim()
}

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@moon/compute", "@moon/time", "@moon/protocol"],

  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: false,
  cacheComponents: false,
  experimental: {
    viewTransition: true,
  },
  async rewrites() {
    const apiUrl =
      process.env.MOON_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://api:4000"
    return [
      {
        source: "/health/:path*",
        destination: `${apiUrl}/health/:path*`,
      },
      {
        source: "/db/:path*",
        destination: `${apiUrl}/db/:path*`,
      },
      {
        source: "/api/services/:path*",
        destination: `${apiUrl}/api/services/:path*`,
      },
      {
        source: "/api/system/:path*",
        destination: `${apiUrl}/api/system/:path*`,
      },
      {
        source: "/api/witness/:path*",
        destination: `${apiUrl}/api/witness/:path*`,
      },
      {
        source: "/api/meta/:path*",
        destination: `${apiUrl}/api/meta/:path*`,
      },
    ]
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
    config.resolve = config.resolve || {}
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    }

    config.externals = config.externals || []
    if (Array.isArray(config.externals)) {
      config.externals.push(
        "knex",
        "@moon/orm",
        "@moon/server",
        "@moon/khidra",
        "oracledb",
        "mariadb/callback"
      )
    }
    return config
  },
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
}

export default withSerwist(nextConfig)
