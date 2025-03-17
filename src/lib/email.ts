// src/lib/email.ts
import { Resend } from 'resend';
// Importamos el tipo directamente de la biblioteca Resend
import type { CreateEmailResponse } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY no está configurada en las variables de entorno');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Interfaz para nuestra respuesta personalizada
interface EmailResponse {
  success: boolean;
  error?: string;
  data?: CreateEmailResponse;
}

export const emailService = {
  async sendVerificationCode(
    email: string,
    verificationCode: string
  ): Promise<EmailResponse> {
    try {
      const data = await resend.emails.send({
        from: 'Niux CRM <onboarding@resend.dev>',
        to: email,
        subject: 'Verifica tu cuenta - Niux CRM',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; font-size: 24px;">Verifica tu cuenta</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Tu código de verificación es:
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 4px;">
                  ${verificationCode}
                </span>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Este código expirará en 30 minutos.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Si no solicitaste este código, por favor ignora este mensaje.
              </p>
            </div>
          </div>
        `
      });

      return { success: true, data };
    } catch (error: unknown) {
      console.log('Error al enviar email de verificación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  },

  async sendWelcomeEmail(
    email: string,
    name: string,
    businessName: string
  ): Promise<EmailResponse> {
    try {
      const data = await resend.emails.send({
        from: 'Niux CRM <onboarding@resend.dev>',
        to: email,
        subject: '¡Bienvenido a Niux CRM!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; font-size: 24px;">¡Bienvenido a Niux CRM!</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                ¡Hola ${name}!
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Tu cuenta ha sido verificada exitosamente. Ahora formas parte de ${businessName} 
                en Niux CRM.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://niuxcrm.com/dashboard" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Ir al Dashboard
                </a>
              </div>

              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Con Niux CRM podrás:
                <ul>
                  <li>Gestionar tus clientes y prospectos</li>
                  <li>Dar seguimiento a tus oportunidades de venta</li>
                  <li>Organizar tus actividades y tareas</li>
                  <li>Analizar tu desempeño comercial</li>
                </ul>
              </p>
            </div>
          </div>
        `
      });

      return { success: true, data };
    } catch (error: unknown) {
      console.error('Error al enviar email de bienvenida:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  },
  
  async sendWelcomeEmailInvitation(
    email: string,
    name: string,
    password: string,
    businessName: string
  ): Promise<EmailResponse> {
    try {
      const data = await resend.emails.send({
        from: 'Niux CRM <onboarding@resend.dev>',
        to: email,
        subject: '¡Bienvenido a Niux CRM!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; font-size: 24px;">¡Bienvenido a Niux CRM!</h1>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                ¡Hola ${name}!
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Ahora formas parte de ${businessName} 
                en Niux CRM. la siguiente es tu contraseña puedes ingresar para cambiar la contraseña 
              </p>

              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
                <span style="font-size: 20px; font-weight: bold; color: #007bff; letter-spacing: 4px;">
                  ${password}
                </span>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://niuxcrm.com/dashboard" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Ir al Dashboard
                </a>
              </div>

              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Con Niux CRM podrás:
                <ul>
                  <li>Gestionar tus clientes y prospectos</li>
                  <li>Dar seguimiento a tus oportunidades de venta</li>
                  <li>Organizar tus actividades y tareas</li>
                  <li>Analizar tu desempeño comercial</li>
                </ul>
              </p>
            </div>
          </div>
        `
      });

      return { success: true, data };
    } catch (error: unknown) {
      console.error('Error al enviar email de bienvenida:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, error: errorMessage };
    }
  }
};