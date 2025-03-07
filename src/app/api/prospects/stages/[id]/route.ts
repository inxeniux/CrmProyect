import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Segments {
  params: Promise<{
    id: string;

  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Segments
): Promise<NextResponse> {
  try {
    const { id } = await  params;

    // Validar que el ID sea un número válido
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid funnel ID' }, { status: 400 });
    }

    const funnelIdNum = parseInt(id, 10);

    // Obtener los stages relacionados al funnel_id
    const funnelStages = await prisma.funnelStage.findMany({
      where: { funnel_id: funnelIdNum },
      orderBy: { position: 'asc' }, // Ordenar por posición
    });

    return NextResponse.json(funnelStages);
  } catch (error) {
    console.error('Error fetching funnel stages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
