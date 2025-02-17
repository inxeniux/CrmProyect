// src/app/api/prospects/[id]/stage/route.ts
import { NextResponse,NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/funnels/:name → Devuelve todas las coincidencias
export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const {searchParams} = new URL(req.url);
    const table = searchParams.get('table')
    const { name } = params;

    if (!table ||!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    // Validamos que la tabla solicitada sea una de las permitidas
    const allowedTables = ['client', 'task', 'prospects','funnel'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      );
    }
  // Asignar la columna según la tabla
  let columnName = 'name';
  if (table === 'client') columnName = 'contact_name';
  if (table === 'task') columnName = 'title';

  // Query segura usando `$queryRawUnsafe`
  const query = `SELECT * FROM ${table} WHERE LOWER(${columnName}) LIKE LOWER(?)`;
  const results = await prisma.$queryRawUnsafe(query, `%${name}%`);


   if (results.length === 0) {
     return NextResponse.json({ message: "No Data found" }, { status: 404 });
   }



    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching funnels:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}