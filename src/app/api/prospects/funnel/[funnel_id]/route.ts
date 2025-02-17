import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { funnel_id?: string } }
): Promise<NextResponse> {
  const funnelId = params?.funnel_id;

  // Validar que funnel_id esté presente y sea un número válido
  if (!funnelId || isNaN(Number(funnelId))) {
    return NextResponse.json(
      { error: 'Funnel ID is required and must be a valid number' },
      { status: 400 }
    );
  }

  const funnelIdNum = parseInt(funnelId, 10);

  try {
    // Obtener todos los prospectos asociados al funnel_id con sus clientes
    const prospects = await prisma.prospect.findMany({
      where: { funnel_id: funnelIdNum },
      include: { Client: true },
    });

    // Obtener los stages relacionados al funnel_id
    const stages = await prisma.funnelStage.findMany({
      where: { funnel_id: funnelIdNum },
      orderBy: { position: 'asc' },
    });

    // Responder con los prospectos y sus stages
    return NextResponse.json({ funnel_id: funnelIdNum, prospects, stages });
  } catch (error) {
    console.error('Error fetching prospects and funnel stages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
