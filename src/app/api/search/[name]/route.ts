import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    name: string;
  }>;
}

// Definir tipo más específico para los resultados de búsqueda en la tabla "client"
type ClientSearchResult = {
  client_id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone_number: string;
  status: string;
  priority: string;
  created_at: Date;
};

// Definir tipo más específico para los resultados de búsqueda en la tabla "task"
type TaskSearchResult = {
  task_id: number;
  title: string;
  description: string;
  due_date: Date;
  status: string;
  created_at: Date;
};

// Definir tipo más específico para los resultados de búsqueda en la tabla "prospects"
type ProspectSearchResult = {
  prospect_id: number;
  name: string;
  funnel_id: number;
  email: string;
  phone_number: string;
  status: string;
  created_at: Date;
};

// Definir tipo más específico para los resultados de búsqueda en la tabla "funnel"
type FunnelSearchResult = {
  funnel_id: number;
  name: string;
  description: string;
  created_at: Date;
};

export async function GET(req: NextRequest, { params }: Segments) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get('table');
    const { name } = await params;

    if (!table || !name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validamos que la tabla solicitada sea una de las permitidas
    const allowedTables = ['client', 'task', 'prospects', 'funnel'];
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

    // Query segura usando `$queryRawUnsafe` con tipo específico
    let results: ClientSearchResult[] | TaskSearchResult[] | ProspectSearchResult[] | FunnelSearchResult[] = [];

    const query = `SELECT * FROM ${table} WHERE LOWER(${columnName}) LIKE LOWER(?)`;
    results = await prisma.$queryRawUnsafe(query, `%${name}%`);

    if (results.length === 0) {
      return NextResponse.json({ message: "No Data found" }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching funnels:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
