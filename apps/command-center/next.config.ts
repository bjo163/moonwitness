import type { NextConfig } from "next"

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
}

export default nextConfig