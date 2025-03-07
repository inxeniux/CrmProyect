import { PrismaClient } from '@prisma/client'

// Extender la interfaz globalThis para incluir la propiedad prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Crear una instancia del cliente o reutilizar la existente
const prisma = global.prisma || new PrismaClient()

// En desarrollo, guardar la instancia en el objeto global para evitar
// múltiples instancias durante hot-reloading
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma