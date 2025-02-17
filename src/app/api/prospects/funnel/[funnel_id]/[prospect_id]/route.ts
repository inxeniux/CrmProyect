import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request, 
  { params }: { params: { funnel_id: string; prospect_id: string } }
): Promise<NextResponse> {
  const { funnel_id, prospect_id } = params;

  try {
    // Verificar que funnel_id y prospect_id estén presentes
    if (!funnel_id || !prospect_id) {
      return NextResponse.json({ error: 'Funnel ID and Prospect ID are required' }, { status: 400 });
    }

    // Obtener el prospecto asociado al funnel_id y prospect_id específico, junto con el cliente
    const prospect = await prisma.prospect.findUnique({
      where: { 
        prospect_id: parseInt(prospect_id) 
      },
      include: {
        Client: true, // Relación con el cliente
      },
    });

    // Verificar si el prospecto existe
    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    // Obtener los stages relacionados al funnel_id
    const stages = await prisma.funnelStage.findMany({
      where: { funnel_id: parseInt(funnel_id) },
      orderBy: { position: 'asc' }, // Ordenar por posición
    });

    // Responder con el prospecto y sus stages
    return NextResponse.json({
      funnel_id,
      prospect,
      stages,
    });
  } catch (error) {
    // Manejar errores
    console.error('Error fetching prospect and funnel stages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
