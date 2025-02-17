// src/app/api/prospects/[id]/stage/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { stage, stageName } = await request.json();
    
    const updatedProspect = await prisma.prospect.update({
      where: {
        prospect_id: parseInt(params.id)
      },
      data: {
        stage: stage,
      }
    });
   
    await prisma.activities.create({
      data: {
        prospect_id: parseInt(params.id),
        activity_type: '1',
        activity_date: new Date(), // Fecha actual
        notes: `Cambio de estatus a ${stageName}`, // Mensaje dinámico
      },
    });

    return NextResponse.json(updatedProspect);
  } catch (error) {
    console.error('Error updating prospect stage:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el estado del prospecto' },
      { status: 500 }
    );
  }
}
