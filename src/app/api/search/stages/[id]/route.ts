// app/api/prospects/stages/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const funnelStages = await prisma.funnelStage.findMany({
        where: { funnel_id: parseInt(params.id) }
      });
      return NextResponse.json(funnelStages);
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  