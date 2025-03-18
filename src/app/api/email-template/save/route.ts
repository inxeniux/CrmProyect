import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Faltan datos para guardar la plantilla" },
        { status: 400 }
      );
    }

    const savedTemplate = await prisma.emailTemplate.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(
      { message: "Plantilla guardada", template: savedTemplate },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al guardar la plantilla:", error);
    return NextResponse.json(
      { error: "Error al guardar la plantilla" },
      { status: 500 }
    );
  }
}
