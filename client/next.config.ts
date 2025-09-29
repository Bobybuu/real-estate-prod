import type { NextConfig } from "next";
import withPWA from "next-pwa";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "master.d3iojqgbl70gnb.amplifyapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "real-estate-photos-re.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

const nextConfig = withPWA({
  dest: "public", // folder to output the service worker
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disable PWA in dev mode
})(baseConfig);

export default nextConfig;
