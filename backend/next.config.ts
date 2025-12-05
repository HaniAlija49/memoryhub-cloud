import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Externalize large native packages from serverless bundle (Next.js 16+)
  serverExternalPackages: ['sharp', 'onnxruntime-node', '@xenova/transformers'],

  // Empty turbopack config to silence webpack warning
  turbopack: {},

  // Optimize for Vercel deployment
  output: 'standalone',
};

export default withSentryConfig(nextConfig, {
  org: "persistq",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
