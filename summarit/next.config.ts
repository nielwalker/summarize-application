import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's root to this app to silence multi-lockfile warnings
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
