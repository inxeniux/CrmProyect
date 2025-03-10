/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "your-production-domain.com"],
    },
  },
  serverExternalPackages: [
    "aws-sdk",
    "bcrypt",
    "bcryptjs",
    "mysql2",
    "node-cron",
  ],
  images: {
    domains: [
      "localhost",
      "encrypted-tbn0.gstatic.com",
      "inx-event-marte-bucket.s3.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inx-event-marte-bucket.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
