import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { funnel_id?: string } } // Extraer params correctamente
) {
  if (!params?.funnel_id || isNaN(Number(params.funnel_id))) {
    return NextResponse.json({ error: 'Funnel ID is required and must be a number' }, { status: 400 });
  }

  const funnelIdNum = parseInt(params.funnel_id, 10);

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
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
