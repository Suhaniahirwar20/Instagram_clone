import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    IMGBB_API_KEY:process.env.IMGBB_API_KEY
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
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
