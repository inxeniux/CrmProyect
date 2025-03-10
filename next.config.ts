/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // La opción serverActions debe ser un objeto, no un booleano
    // Se elimina serverComponentsExternalPackages que fue movido
  },
  // Usar la nueva ubicación para serverExternalPackages
  serverExternalPackages: [
    // Añadir aquí los paquetes necesarios
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
