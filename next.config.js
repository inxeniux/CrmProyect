/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
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
  // Desactivar la compresión del output para ayudar con el problema de despliegue
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  // Asegúrate de que no hay configuraciones incorrectas que puedan afectar el routing
  // Añade cualquier otra configuración necesaria aquí
};

module.exports = nextConfig;
