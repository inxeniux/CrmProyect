// app/api/funnels/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateToken } from "@/lib/authToken";

interface Segments {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: Segments
) {
  const { role } = await validateToken(req);
  const {id} = await params;
  if (role !== "Admin") throw new Error("Unauthorized");

  try {
    const funnels = await prisma.user.findMany({
      where: { businessId: parseInt(id) },
    });

    return NextResponse.json(funnels);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener los funnels" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: Segments
): Promise<NextResponse> {
  const { role } = await validateToken(req);
  const {id} = await params;
  if (role !== "Admin") throw new Error("Unauthorized");
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Actualizar usuario
export async function PUT(req: Request) {
  try {
    const { role } = await validateToken(req);
    if (role !== "Admin") throw new Error("Unauthorized");

    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      role: newRole,
      status, // Agregamos el parámetro status
    } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role: newRole,
        phoneNumber,
        status, // Incluimos status en la actualización
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 400 }
    );
  }
}
