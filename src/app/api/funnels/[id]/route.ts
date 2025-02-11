

// app/api/funnels/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const funnel = await prisma.funnels.findUnique({
        where: { funnel_id: parseInt(params.id) }
      });
      
      if (!funnel) {
        return NextResponse.json({ error: 'Funnel not found' }, { status: 404 });
      }
      return NextResponse.json(funnel);
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const data = await req.json();
      await prisma.funnel.update({
        where: { funnel_id: parseInt(params.id) },
        data
      });
      return NextResponse.json({ message: 'Funnel updated successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
    
      const funnelId = parseInt(params.id);

      // Get all prospects related to funnel
      const prospects = await prisma.prospect.findMany({
        where: { funnel_id: funnelId }
      });
      
      const prospectIds = prospects.map(p => p.prospect_id);
      
      // Delete in transaction
      await prisma.$transaction([
        // Delete related activities
        prisma.activities.deleteMany({
          where: { prospect_id: { in: prospectIds } }
        }),
        // Delete related prospects
        prisma.prospect.deleteMany({
          where: { funnel_id: funnelId }
        }),
        // Delete funnel stages
        prisma.funnelStage.deleteMany({
          where: { funnel_id: funnelId }
        }),
        // Delete funnel
        prisma.funnel.delete({
          where: { funnel_id: funnelId }
        })
      ]);
  
      return NextResponse.json({ message: 'Funnel and related data deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }