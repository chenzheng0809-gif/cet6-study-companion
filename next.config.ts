import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * This app is local-first: every page reads "now" (countdown, today, streak)
   * and all records live in the student's IndexedDB. Cache Components would
   * prerender those time reads, so we opt out and ship a stable shell instead.
   */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
