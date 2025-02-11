// src/lib/services/registration.service.ts
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { emailService } from '@/lib/email';
import { sign } from 'jsonwebtoken'; // Asegúrate de tener instalado jsonwebtoken
import jwt from 'jsonwebtoken';



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
  token:string
}

export class RegistrationService {
  static async initiateRegistration(email: string) {
    try {
      // Verificar si el email ya está registrado como usuario
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
  
      // Buscar la verificación más reciente para este email
      const lastVerification = await prisma.emailVerification.findFirst({
        where: { 
          email,
          isVerified: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      // Verificar si han pasado al menos 3 minutos desde el último código
      if (lastVerification) {
        const timeSinceLastCode = Date.now() - lastVerification.createdAt.getTime();
        const threeMinutesInMs = 3 * 60 * 1000;
  
        if (timeSinceLastCode < threeMinutesInMs) {
          const timeToWait = Math.ceil((threeMinutesInMs - timeSinceLastCode) / 1000);
          throw new Error(`Por favor espera ${timeToWait} segundos antes de solicitar un nuevo código`);
        }
      }
  
      // Generar nuevo código de verificación
      const verificationCode = Math.random().toString().slice(2, 8);
  
      // Crear o actualizar la entrada de verificación
      if (lastVerification) {
        // Actualizar el registro existente
        await prisma.emailVerification.update({
          where: { id: lastVerification.id },
          data: {
            code: verificationCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
            isVerified: false,
            verifiedAt: null,
            createdAt: new Date() // Actualizar la fecha de creación
          }
        });
      } else {
        // Crear nuevo registro
        await prisma.emailVerification.create({
          data: {
            email,
            code: verificationCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            isVerified: false
          }
        });
      }
  
      // Enviar código de verificación
      await emailService.sendVerificationCode(email, verificationCode);
  
      return {
        success: true,
        mensaje: 'Código de verificación enviado correctamente'
      };
    } catch (error) {
      throw error;
    }
  }


static async completeRegistration(data: CompleteRegistrationData) {
  const { email, code, password, firstName, lastName, phoneNumber } = data;
  console.log(password)
  try {
    // Verify code
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
      throw new Error('Invalid or expired verification code');
    }

    // Start transaction for user and business creation
    return await prisma.$transaction(async (prisma) => {
      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
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

      // Update verification status
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: {
          isVerified: true,
          verifiedAt: new Date()
        }
      });

      // Generar token JWT
      const token = sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          status: user.status
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' } // Token válido por 7 días
      );

      return {
        success: true,
        user,
        token,
        message: 'User created successfully. Please complete business information'
      };
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
}
static async completeBuisnessRegistration(data: CompleteRegistrationBusinessData) {
  const { name, industry, address, website, email, phoneNumber, token } = data;

  try {
   
    const decoded = jwt.decode(token, { complete: true });


    // Start transaction for user and business creation
    return await prisma.$transaction(async (prisma) => {
     // Create user
     const business = await prisma.business.create({
      data: {
        email,
        name,
        industry,
        address,
        website,
        phoneNumber
      }
    });
     
    console.log(decoded)
      // Create user usando el ID del token
     const user =  await prisma.user.update({
        where: { 
          email: decoded.payload.email
        },
        data: {
          status: 'Active',
          businessId:business.id
        }
      });

      // Generar nuevo token con la información actualizada
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
        message: 'Business information created successfully'
      };
    });
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}
}
