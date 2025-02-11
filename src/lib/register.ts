// src/lib/registration.ts
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { emailService } from './email';

export interface PreRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface BusinessData {
  name: string;
  industry?: string;
  phoneNumber?: string;
  address?: string;
  website?: string;
}

class RegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegistrationError';
  }
}

export class RegistrationService {
  private static VERIFICATION_EXPIRY_MINUTES = 30;

  private static generateVerificationCode(): string {
    return Math.random().toString().slice(2, 8);
  }

  static async preRegisterUser(data: PreRegisterData) {
    const { email, password, firstName, lastName } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: email } // Usando email como username temporal
        ]
      }
    });

    if (existingUser) {
      throw new RegistrationError('Este email ya está registrado');
    }

    // Iniciar transacción
    return await prisma.$transaction(async (tx) => {
      // Hashear contraseña
      const hashedPassword = await hash(password, 12);

      // Crear usuario en estado pendiente
      const user = await tx.user.create({
        data: {
          email,
          username: email, // Temporal, se puede actualizar después
          password: hashedPassword,
          firstName,
          lastName,
          status: 'PENDING_VERIFICATION',
          role: 'Customer',
          businessId: 0 // Temporal hasta crear el negocio
        }
      });

      // Generar código de verificación
      const verificationCode = this.generateVerificationCode();
      
      // Guardar código de verificación
      await tx.emailVerification.create({
        data: {
          email,
          code: verificationCode,
          expiresAt: new Date(Date.now() + this.VERIFICATION_EXPIRY_MINUTES * 60 * 1000)
        }
      });

      // Enviar email con código
      await emailService.sendVerificationCode(email, verificationCode);

      return {
        success: true,
        userId: user.id,
        message: 'Pre-registro exitoso. Revisa tu email para verificar tu cuenta.'
      };
    });
  }

  static async verifyEmail(email: string, code: string) {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        isVerified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!verification) {
      throw new RegistrationError('Código inválido o expirado');
    }

    // Actualizar en transacción
    return await prisma.$transaction(async (tx) => {
      // Marcar verificación como completada
      await tx.emailVerification.update({
        where: { id: verification.id },
        data: {
          isVerified: true,
          verifiedAt: new Date()
        }
      });

      // Actualizar estado del usuario
      const user = await tx.user.update({
        where: { email },
        data: { status: 'PENDING_BUSINESS' }
      });

      return {
        success: true,
        userId: user.id,
        message: 'Email verificado correctamente'
      };
    });
  }

  static async createBusiness(userId: number, businessData: BusinessData) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new RegistrationError('Usuario no encontrado');
    }

    if (user.status !== 'PENDING_BUSINESS') {
      throw new RegistrationError('El usuario no está en el estado correcto para este paso');
    }

    // Crear negocio y actualizar usuario en transacción
    return await prisma.$transaction(async (tx) => {
      // Crear negocio
      const business = await tx.business.create({
        data: {
          ...businessData,
          email: user.email // Usar el email del usuario como email del negocio
        }
      });

      // Actualizar usuario con el negocio y estado final
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          businessId: business.id,
          status: 'Active'
        }
      });

      // Enviar email de bienvenida
      await emailService.sendWelcomeEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        business.name
      );

      return {
        success: true,
        user: updatedUser,
        business,
        message: 'Registro completado exitosamente'
      };
    });
  }

  static async checkRegistrationStatus(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new RegistrationError('Usuario no encontrado');
    }

    return {
      status: user.status,
      isVerified: user.status !== 'PENDING_VERIFICATION',
      isComplete: user.status === 'Active'
    };
  }
}