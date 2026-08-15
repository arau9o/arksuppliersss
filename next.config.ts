import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Stripe webhook body parsing
  async headers() {
    return [
      {
        source: "/api/webhook",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
