/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ← allows ANY https domain
      },
      {
        protocol: "http",
        hostname: "**", // ← allows ANY http domain
      },
    ],
  },
};
export default nextConfig;