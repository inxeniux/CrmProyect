// src/lib/services/registration.service.ts
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { emailService } from '@/lib/email';
import { sign, verify, JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

interface CompleteRegistrationData {
  email: string;
  code: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessData?: {
    name: string;
    industry?: string;
    phoneNumber?: string;
    address?: string;
    website?: string;
  };
}

interface CompleteRegistrationBusinessData {
  email: string;
  website: string;
  industry: string;
  address: string;
  name: string;
  phoneNumber?: string;
  token: string;
}

export class RegistrationService {
  static async initiateRegistration(email: string) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return {
          success: false,
          status: 409,
          message: 'El email ya está registrado'
        };
      }

      const lastVerification = await prisma.emailVerification.findFirst({
        where: { email, isVerified: false },
        orderBy: { createdAt: 'desc' }
      });

      if (lastVerification) {
        const timeSinceLastCode = Date.now() - lastVerification.createdAt.getTime();
        const threeMinutesInMs = 3 * 60 * 1000;

        if (timeSinceLastCode < threeMinutesInMs) {
          const timeToWait = Math.ceil((threeMinutesInMs - timeSinceLastCode) / 1000);
          throw new Error(`Por favor espera ${timeToWait} segundos antes de solicitar un nuevo código`);
        }
      }

      const verificationCode = Math.random().toString().slice(2, 8);

      if (lastVerification) {
        await prisma.emailVerification.update({
          where: { id: lastVerification.id },
          data: {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            isVerified: false,
            verifiedAt: null,
            createdAt: new Date()
          }
        });
      } else {
        await prisma.emailVerification.create({
          data: {
            email,
            code: verificationCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            isVerified: false
          }
        });
      }

      await emailService.sendVerificationCode(email, verificationCode);

      return {
        success: true,
        message: 'Código de verificación enviado correctamente'
      };
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  static async completeRegistration(data: CompleteRegistrationData) {
    const { email, code, password, firstName, lastName, phoneNumber } = data;

    try {
      const verification = await prisma.emailVerification.findFirst({
        where: {
          email,
          code,
          isVerified: false,
          expiresAt: { gt: new Date() }
        }
      });

      if (!verification) {
        throw new Error('Código de verificación inválido o expirado');
      }

      return await prisma.$transaction(async (prisma) => {
        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            status: 'PENDING_BUSINESS',
            role: 'Admin'
          }
        });

        await prisma.emailVerification.update({
          where: { id: verification.id },
          data: {
            isVerified: true,
            verifiedAt: new Date()
          }
        });

        const token = sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
            status: user.status
          },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          user,
          token,
          message: 'Usuario creado correctamente. Por favor completa la información del negocio'
        };
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async completeBusinessRegistration(data: CompleteRegistrationBusinessData) {
    const { name, industry, address, website, email, phoneNumber, token } = data;

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!decoded.email) {
        throw new Error('Token inválido: falta el email');
      }

      return await prisma.$transaction(async (prisma) => {
        const business = await prisma.business.create({
          data: { email, name, industry, address, website, phoneNumber }
        });

        const user = await prisma.user.update({
          where: { email: decoded.email },
          data: { status: 'Active', businessId: business.id }
        });

        const newToken = sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
            status: user.status
          },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return {
          success: true,
          business,
          token: newToken,
          message: 'Información del negocio creada exitosamente'
        };
      });
    } catch (error) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      throw error;
    }
  }
}
