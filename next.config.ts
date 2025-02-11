/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com'], // Agregar el dominio aquí
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

module.exports = nextConfig