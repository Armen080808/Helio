import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-neon", "@neondatabase/serverless", "@prisma/client"],
};

export default nextConfig;
