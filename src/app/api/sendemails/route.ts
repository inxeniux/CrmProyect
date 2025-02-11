import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
 
  try {
    const { funnel_id, stage, subject, message } = await req.json();
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

    // Filtrar prospectos con email válido
    const recipients = prospects
      .filter(prospect => prospect.Client?.email)
      .map(prospect => prospect.Client!.email);

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 404 });
    }

    // Enviar correos en paralelo
    const emailPromises = recipients.map(async (email) => {
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
