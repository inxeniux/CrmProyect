// src/app/api/prospects/[id]/stage/route.ts
import { NextResponse,NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/funnels/:name → Devuelve todas las coincidencias
export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const { name } = params;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

     // Búsqueda insensible a mayúsculas con LOWER()
     const funnels = await prisma.$queryRaw`
     SELECT * FROM Funnel WHERE LOWER(name) LIKE LOWER(${`%${name}%`})
   `;

   if (funnels.length === 0) {
     return NextResponse.json({ message: "No funnels found" }, { status: 404 });
   }



    return NextResponse.json(funnels);
  } catch (error) {
    console.error("Error fetching funnels:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}