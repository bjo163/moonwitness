import type { NextConfig } from "next"
import path from "path"

if (!process.env.NODE_OPTIONS?.includes("--no-deprecation")) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} --no-deprecation`.trim()
}

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/state",
    "@workspace/hooks",
    "@workspace/error",
    "@workspace/types",
    "@moon/client",
    "@moon/compute",
    "@moon/witness",
    "@moon/time",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: false,
  cacheComponents: false,
  experimental: {
    viewTransition: true,
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
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
}

export default nextConfig