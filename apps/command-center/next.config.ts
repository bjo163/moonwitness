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
    "@workspace/state",
    "@workspace/hooks",
    "@workspace/error",
    "@workspace/types",
    "@moon/client",
    "@moon/compute",
    "@moon/witness",
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

    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^(?:\.\/|\.\.\/).*\.js$/,
        (resource: any) => {
          if (!resource || typeof resource.request !== "string") return
          const fs = require("fs")
          const path = require("path")
          const context = resource.context || (resource.resource ? path.dirname(resource.resource) : "")
          if (!context) return
          const tsPath = path.join(context, resource.request.slice(0, -3) + ".ts")
          if (fs.existsSync(tsPath)) {
            resource.request = resource.request.replace(/\.js$/, ".ts")
          }
        }
      )
    )

    return config
  },
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
}

export default nextConfig