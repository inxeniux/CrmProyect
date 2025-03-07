import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define la interfaz para el cuerpo de la solicitud
interface EmailRequestBody {
  funnel_id?: string | number;
  stage?: string;
  subject: string;
  message: string;
}



export async function POST(req: Request) {
  try {
    const { funnel_id, stage, subject, message } = await req.json() as EmailRequestBody;
    
    // Obtener prospectos desde Prisma filtrando por funnel y stage
    const prospects = await prisma.prospect.findMany({
      where: { 
        funnel_id: funnel_id ? Number(funnel_id) : undefined,
        stage: stage || undefined
      },
      include: {
        Client: {
          select: { email: true }
        }
      }
    });

    // Filtrar prospectos con email válido y asegurarnos de que no haya valores null
    const recipients = prospects
      .filter((prospect) => prospect.Client?.email) // Filtramos prospectos sin email
      .map((prospect) => prospect.Client!.email); // Garantizamos que el email es un string (no null)

    // Filtrar valores nulos antes de enviar los correos
    const validRecipients = recipients.filter((email): email is string => email !== null);

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 404 });
    }

    // Enviar correos en paralelo
    const emailPromises = validRecipients.map(async (email: string) => {
      try {
        const response = await resend.emails.send({
          from: "Niux CRM <hola@knowmeapp.com>", // ⚠️ IMPORTANTE: Usa un dominio verificado
          to: email,
          subject,
          html: `<p>${message}</p>`,
        });

        console.log(`Correo enviado a ${email}:`, response);
        return response;
      } catch (err) {
        console.error(`Error al enviar a ${email}:`, err);

        // Validación segura del error
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    
        return { error: errorMessage };
      }
    });

    const results = await Promise.all(emailPromises);

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
