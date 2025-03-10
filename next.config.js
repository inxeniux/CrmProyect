/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"], // Permitir todas las solicitudes
    },
  },
  serverComponentsExternalPackages: [
    // Cambio en la opción de Next.js 15+
    "aws-sdk",
    "bcrypt",
    "bcryptjs",
    "mysql2",
    "node-cron",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inx-event-marte-bucket.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  reactStrictMode: true,
  // output: "standalone", // Prueba desactivándolo si sigue el error
};

module.exports = nextConfig;
