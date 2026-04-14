import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-neon", "@neondatabase/serverless", "@prisma/client"],
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "node:crypto": false,
        "node:path": false,
        "node:process": false,
        "node:url": false,
        "node:fs": false,
        "node:os": false,
        "node:module": false,
        crypto: false,
        path: false,
        fs: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
