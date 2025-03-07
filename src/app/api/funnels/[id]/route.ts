

// app/api/funnels/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


interface Segments {
  params: Promise<{
    id: string;
  }>;
}




export async function GET(req: Request, { params }: Segments) {
    try {
      const {id} = await params;
      const funnel = await prisma.funnel.findUnique({
        where: { funnel_id: parseInt(id) }
      });
      
      if (!funnel) {
        return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
      }
      return NextResponse.json(funnel);
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  export async function PUT(req: Request, { params }: Segments) {
    try {
      const {id} = await params;
      const data = await req.json();
      await prisma.funnel.update({
        where: { funnel_id: parseInt(id) },
        data
      });
      return NextResponse.json({ message: 'Funnel updated successfully' });
    } catch  {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function DELETE(req: Request, { params }: Segments) {
    try {
      const { id } = await params;
      const funnelId = parseInt(id);
  
      // Obtener todos los prospectos relacionados con el funnel
      const prospects = await prisma.prospect.findMany({
        where: { funnel_id: funnelId }
      });
  
      // Asegúrate de que el tipo de los prospectos sea correcto
      const prospectIds = prospects.map((prospect) => prospect.prospect_id);
  
      // Eliminar en una transacción
      await prisma.$transaction([
        // Eliminar actividades relacionadas
        prisma.activities.deleteMany({
          where: { prospect_id: { in: prospectIds } }
        }),
        // Eliminar prospectos relacionados
        prisma.prospect.deleteMany({
          where: { funnel_id: funnelId }
        }),
        // Eliminar etapas del funnel
        prisma.funnelStage.deleteMany({
          where: { funnel_id: funnelId }
        }),
        // Eliminar el funnel
        prisma.funnel.delete({
          where: { funnel_id: funnelId }
        })
      ]);
  
      return NextResponse.json({ message: 'Funnel and related data deleted successfully' });
    } catch (error) {
      console.error('Error deleting funnel:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  