// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Clients_priority } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const client = await prisma.client.create({ data });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}




export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const sortBy = searchParams.get('sortBy') || 'company_name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Validar parámetros de paginación
    const validatedPage = page > 0 ? page : 1;
    const validatedPageSize = pageSize > 0 && pageSize <= 100 ? pageSize : 10;

    // Calcular skip para la paginación
    const skip = (validatedPage - 1) * validatedPageSize;

    // Definir el tipo para las condiciones de búsqueda con Prisma
    type SearchCondition = {
      contains: string;
      mode: 'insensitive' | 'sensitive';
    };

    // Construir filtros
    const where: {
      OR?:  { 
        company_name?: SearchCondition;
        contact_name?: SearchCondition;
        email?: SearchCondition;
        phone_number?: SearchCondition;
      }[];
      status?: string;
      priority?: Clients_priority;
    } = {};

    // Filtro de búsqueda en múltiples campos
    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { contact_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone_number: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro por estado
    if (status) {
      where.status = status;
    }

    // Filtro por prioridad - Manejar el enum correctamente
    if (priority && Object.values(Clients_priority).includes(priority as Clients_priority)) { where.priority = priority as Clients_priority; }

    // Validar campo de ordenamiento para evitar inyección SQL
    const validSortFields = [
      'client_id', 'company_name', 'contact_name', 'email',
      'phone_number', 'status', 'priority', 'created_at'
    ];

    const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'company_name';
    const validatedSortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    // Construir objeto de ordenamiento
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[validatedSortBy] = validatedSortOrder;

    // Consulta para contar el total de registros con los filtros aplicados
    const totalCount = await prisma.client.count({ where });

    // Consulta principal con paginación, ordenamiento y filtros
    const clients = await prisma.client.findMany({
      where,
      skip,
      take: validatedPageSize,
      orderBy
    });

    // Calcular total de páginas
    const totalPages = Math.ceil(totalCount / validatedPageSize);

    // Preparar respuesta con meta información para la paginación
    return NextResponse.json({
      data: clients,
      meta: {
        page: validatedPage,
        pageSize: validatedPageSize,
        totalCount,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1
      }
    });

  } catch (error) {
    console.error('Error al recuperar clientes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

