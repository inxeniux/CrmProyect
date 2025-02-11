import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    const prompt = `
      Genera una plantilla de correo profesional a partir del siguiente texto:
      ---
      ${rawText}
      ---
      **Formato de respuesta:**  
      Devuelve un JSON con la siguiente estructura:  
      {
        "subject": "Asunto del correo",
        "body": "Cuerpo del correo"
      }
      **Instrucciones:**  
      - El "subject" debe ser atractivo y breve.  
      - El "body" debe estar estructurado en saludo, cuerpo y cierre.  
      - Usa emojis donde sea apropiado.  
      - Si detectas un nombre de cliente, inclúyelo dinámicamente con {client_name}.  
      - **No incluyas ningún texto adicional fuera del JSON.**  
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
    });

    // Extraemos la respuesta generada
    const content = response.choices[0].message?.content || "{}";

    // Aseguramos que la respuesta sea un JSON válido
    const result = JSON.parse(content);

    return NextResponse.json({
      message: "Plantilla generada",
      subject: result.subject || "Sin asunto",
      body: result.body || "No se pudo generar el contenido.",
    });

  } catch (error) {
    console.error("Error generando la plantilla:", error);
    return NextResponse.json({ error: "Error al generar la plantilla" }, { status: 500 });
  }
}
