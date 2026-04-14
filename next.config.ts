import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["prisma-adapter-sqlite", "@prisma/client"],
  webpack(config, { isServer }) {
    if (!isServer) {
      // Stub out Node.js built-ins that server-only packages (Prisma, Auth.js)
      // transitively reference. They should never reach the client bundle, but
      // webpack needs a fallback to avoid hard errors during analysis.
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
