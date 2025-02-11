// src/app/api/prospects/[id]/stage/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { stage,stageName} = await request.json();
    
   /*const prospect = await prisma.prospect.findUnique({
      where: {
        prospect_id: parseInt(params.id)
      }
    });*/
    const updatedProspect = await prisma.prospect.update({
      where: {
        prospect_id: parseInt(params.id)
      },
      data: {
        stage:stage,
        
      }
    });
   
    await prisma.activities.create({
        data: {
          prospect_id: parseInt(params.id),
          activity_type: '1',
          activity_date: new Date(), // Utiliza new Date() para obtener la fecha actual
          notes: `Cambio de estatus a ${stageName}`, // Utilizar template literal para las notas
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