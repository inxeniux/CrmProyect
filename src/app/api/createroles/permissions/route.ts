import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
      // Obtener todos los roles con sus permisos asociados
      const permissions = await prisma.permissions.findMany();
      return NextResponse.json(permissions, { status: 200 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Error obteniendo roles' }, { status: 500 });
    }
  }
  