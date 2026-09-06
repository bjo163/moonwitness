import type { NextConfig } from "next"
import path from "path"
// @ts-ignore
import webpack from "webpack"

if (!process.env.NODE_OPTIONS?.includes("--no-deprecation")) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} --no-deprecation`.trim()
}

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@moon/compute",
    "@moon/time",
    "@moon/protocol",
  ],
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
      "http://127.0.0.1:4000"
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
        source: "/api/meta/:path*",
        destination: `${apiUrl}/api/meta/:path*`,
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

export default nextConfig